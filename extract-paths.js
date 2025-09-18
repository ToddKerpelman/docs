const fs = require("fs");
const path = require("path");

// Import the full OpenAPI spec
const { OpenAPILatest } = require("./openapi/src/full-index.js");
// Import categories configuration
const { categoriesToExtract } = require("./openapi/src/categories.js");

// Flatten for individual group file creation (backward compatibility)
const pathsToExtract = categoriesToExtract.flatMap(category => category.groups);

// Load code samples for a given group
function loadCodeSamples(groupName) {
  const codeSamplesPath = path.join(
    __dirname,
    "openapi",
    "src",
    `${groupName.toLowerCase()}.json`
  );
  try {
    if (fs.existsSync(codeSamplesPath)) {
      return JSON.parse(fs.readFileSync(codeSamplesPath, "utf8"));
    }
  } catch (error) {
    console.warn(
      `Could not load code samples from ${codeSamplesPath}:`,
      error.message
    );
  }
  return {};
}

// Create a new OpenAPI spec with only the specified paths
function extractPaths(originalSpec, targetPaths, groupName) {
  const newSpec = {
    openapi: originalSpec.openapi,
    servers: originalSpec.servers,
    info: originalSpec.info,
    tags: originalSpec.tags,
    security: originalSpec.security,
    paths: {},
  };

  // Load code samples for this group
  const codeSamples = loadCodeSamples(groupName);

  // Extract only the specified paths
  targetPaths.forEach((pathKey) => {
    if (originalSpec.paths[pathKey]) {
      // Deep copy the path object
      const pathObject = JSON.parse(
        JSON.stringify(originalSpec.paths[pathKey])
      );

      // Add x-mint metadata with title for each HTTP method
      Object.keys(pathObject).forEach((method) => {
        if (pathObject[method] && typeof pathObject[method] === "object") {
          pathObject[method]["x-mint"] = {
            metadata: {
              title: pathKey,
            },
          };
          pathObject[method]["tags"] = ["Endpoints"];

          // Add code samples if available
          if (codeSamples[pathKey]) {
            const xCodeSamples = [];
            const endpointSamples = codeSamples[pathKey];

            // Convert each language sample to the x-codeSamples format
            Object.keys(endpointSamples).forEach((lang) => {
              xCodeSamples.push({
                lang: lang,
                label: `${pathKey} - ${lang}`,
                source: endpointSamples[lang],
              });
            });

            if (xCodeSamples.length > 0) {
              pathObject[method]["x-codeSamples"] = xCodeSamples;
            }
          }

          if (
            pathObject[method]["responses"] &&
            pathObject[method]["responses"].hasOwnProperty("default")
          ) {
            delete pathObject[method]["responses"]["default"];
          }
          pathObject[method]["responses"]["200"]["content"]["application/json"][
            "schema"
          ]["description"] = "";
          pathObject[method]["requestBody"]["content"]["application/json"][
            "schema"
          ]["description"] = "";
        }
      });

      newSpec.paths[pathKey] = pathObject;
    } else {
      console.warn(`Path "${pathKey}" not found in original spec`);
    }
  });

  return newSpec;
}

// Create individual group files
pathsToExtract.forEach((group) => {
  const extractedSpec = extractPaths(OpenAPILatest, group.paths, group.group);
  const outputPath = path.join(__dirname, "openapi", `${group.group}.json`);
  fs.writeFileSync(outputPath, JSON.stringify(extractedSpec, null, 2));

  console.log(
    `Created ${outputPath} with ${
      Object.keys(extractedSpec.paths).length
    } paths:`
  );
  Object.keys(extractedSpec.paths).forEach((pathKey) => {
    console.log(`  - ${pathKey}`);
  });
});

// Create combined parsed file with group-based tags
function createParsedFile(originalSpec, groupsData) {
  const parsedSpec = {
    openapi: originalSpec.openapi,
    servers: originalSpec.servers,
    info: originalSpec.info,
    tags: originalSpec.tags,
    security: originalSpec.security,
    paths: {},
  };

  groupsData.forEach((group) => {
    // Load code samples for this group
    const codeSamples = loadCodeSamples(group.group);

    group.paths.forEach((pathKey) => {
      if (originalSpec.paths[pathKey]) {
        // Deep copy the path object
        const pathObject = JSON.parse(
          JSON.stringify(originalSpec.paths[pathKey])
        );

        // Add x-mint metadata and group-based tags for each HTTP method
        Object.keys(pathObject).forEach((method) => {
          if (pathObject[method] && typeof pathObject[method] === "object") {
            pathObject[method]["x-mint"] = {
              metadata: {
                title: pathKey,
              },
            };
            pathObject[method]["tags"] = [group.group]; // Use group name as tag

            // Add code samples if available
            if (codeSamples[pathKey]) {
              const xCodeSamples = [];
              const endpointSamples = codeSamples[pathKey];

              // Convert each language sample to the x-codeSamples format
              Object.keys(endpointSamples).forEach((lang) => {
                xCodeSamples.push({
                  lang: lang,
                  label: `${pathKey} - ${lang}`,
                  source: endpointSamples[lang],
                });
              });

              if (xCodeSamples.length > 0) {
                pathObject[method]["x-codeSamples"] = xCodeSamples;
              }
            }

            if (
              pathObject[method]["responses"] &&
              pathObject[method]["responses"].hasOwnProperty("default")
            ) {
              delete pathObject[method]["responses"]["default"];
            }
            pathObject[method]["responses"]["200"]["content"][
              "application/json"
            ]["schema"]["description"] = "";
            pathObject[method]["requestBody"]["content"]["application/json"][
              "schema"
            ]["description"] = "";
          }
        });

        parsedSpec.paths[pathKey] = pathObject;
      } else {
        console.warn(`Path "${pathKey}" not found in original spec`);
      }
    });
  });

  return parsedSpec;
}

// Generate category-based files
console.log("\nCreating category files:");
categoriesToExtract.forEach((category) => {
  const categorySpec = createParsedFile(OpenAPILatest, category.groups);
  const categoryOutputPath = path.join(__dirname, "openapi", `Category${category.category}.json`);
  fs.writeFileSync(categoryOutputPath, JSON.stringify(categorySpec, null, 2));
  
  console.log(
    `Created ${categoryOutputPath} with ${
      Object.keys(categorySpec.paths).length
    } paths from ${category.groups.length} groups.`
  );
});
