import widgetSDK from "@happeo/widget-sdk";

const React = window.React;
const styled = window.styled;
const { happeo, uikit } = widgetSDK;
console.log(styled, happeo, uikit);
const Widget = ({ id }) => {
  const [initialized, setInitialized] = React.useState(false);
  const [context, setContext] = React.useState({});
  const [content, setContent] = React.useState({});
  const [jwt, setJWT] = React.useState({});
  const [user, setUser] = React.useState({ name: { fullName: "" } });
  const [oAuthStatus, setOAuthStatus] = React.useState("");

  React.useEffect(() => {
    const doInit = async () => {
      await happeo.init(id);
      setInitialized(true);
      setUser(await happeo.user.getCurrentUser());
      setContext(await happeo.widget.getContext());
      setContent(await happeo.widget.getContent());
      setJWT(await happeo.widget.getJWT());
    };
    doInit();
  }, [id]);

  if (!initialized) {
    return <uikit.loaders.Loader />;
  }

  return (
    <Container>
      <uikit.typography.TextAlpha>
        Custom widget example
      </uikit.typography.TextAlpha>
      <uikit.typography.TextDelta>User</uikit.typography.TextDelta>
      {user.name.fullName && (
        <UserCard>
          <uikit.avatar.Avatar user={user} />
          <uikit.typography.BodyUI style={{ marginLeft: "8px" }}>
            {user.name.fullName}
          </uikit.typography.BodyUI>
        </UserCard>
      )}

      <uikit.typography.TextDelta>Context</uikit.typography.TextDelta>
      <uikit.typography.BodyUI>
        {JSON.stringify(context)}
      </uikit.typography.BodyUI>
      <uikit.typography.TextDelta>Content</uikit.typography.TextDelta>
      <uikit.typography.BodyUI>
        {JSON.stringify(content)}
      </uikit.typography.BodyUI>
      <uikit.buttons.ButtonPrimary
        text="Update content"
        onClick={() => {
          happeo.widget.setContent("Test", {
            testProp: "This is a test prop",
          });
        }}
      />
      <uikit.typography.TextDelta>JWT</uikit.typography.TextDelta>
      <uikit.typography.BodyUI>{JSON.stringify(jwt)}</uikit.typography.BodyUI>
      <uikit.typography.TextDelta>Start oAuthFlow</uikit.typography.TextDelta>
      <uikit.buttons.ButtonSecondary
        text="Start oAuthFlow"
        onClick={() => {
          happeo.user
            .oAuthBegin()
            .then(() => {
              setOAuthStatus("Success");
            })
            .catch(() => {
              setOAuthStatus("Failure");
            });
        }}
      />
      <uikit.typography.BodyUI>
        Status: {oAuthStatus || "pending status"}
      </uikit.typography.BodyUI>
    </Container>
  );
};

const Container = styled.div``;
const UserCard = styled.div`
  display: flex;
  align-items: center;
`;

export default Widget;
