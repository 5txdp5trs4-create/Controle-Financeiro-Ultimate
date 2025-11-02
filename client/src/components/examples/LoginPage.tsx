import LoginPage from "../LoginPage";

export default function LoginPageExample() {
  return (
    <LoginPage
      onLogin={(user) => console.log('Usuário logado:', user)}
    />
  );
}
