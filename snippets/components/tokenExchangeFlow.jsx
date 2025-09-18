import { StepWithDiagram } from "/snippets/components/stepWithDiagram.jsx";

export const TokenExchangeFlow = () => (
  <>
    <StepWithDiagram asset="/images/link-token-row-1.png" hideBorder>
      <b>The Plaid flow</b> begins when your user wants to connect their bank
      account to your app.
    </StepWithDiagram>
    <StepWithDiagram step={1} asset="/images/link-token-row-2.png">
      Call{" "}
      <a href="/docs/api/link/#linktokencreate">
        <code>/link/token/create</code>
      </a>{" "}
      to create a <code>link_token</code> and pass the temporary token to your
      app's client.
    </StepWithDiagram>
    <StepWithDiagram step={2} asset="/images/link-token-row-3.png">
      Use the <code>link_token</code> to open Link for your user. In the{" "}
      <a href="/docs/link/web/#onsuccess">
        <code>onSuccess</code> callback
      </a>
      , Link will provide a temporary <code>public_token</code>. This token can
      also be obtained on the backend via `/link/token/get`.
    </StepWithDiagram>
    <StepWithDiagram step={3} asset="/images/link-token-row-4.png">
      Call{" "}
      <a href="/docs/api/items/#itempublic_tokenexchange">
        <code>/item/public_token/exchange</code>
      </a>{" "}
      to exchange the <code>public_token</code> for a permanent{" "}
      <code>access_token</code> and <code>item_id</code> for the new{" "}
      <code>Item</code>.
    </StepWithDiagram>
    <StepWithDiagram step={4} asset="/images/link-token-row-5.png">
      Store the <code>access_token</code> and use it to make product requests
      for your user's <code>Item</code>.
    </StepWithDiagram>
  </>
);
