import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";
import { Loader2 } from "lucide-react";

export default function AuthPage() {
  const [tab, setTab] = useState<"login" | "register">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async () => {
    setLoading(true);
    const endpoint = tab === "login" ? "login" : "register";
    try {
      const response = await fetch(`http://localhost:5000/api/auth/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (response.ok) {
        navigate("/dashboard");
      } else {
        alert(tab === "login" ? "Invalid credentials" : "Registration failed");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-screen min-h-screen p-4 bg-gray-50">
      <Tabs defaultValue="login" onValueChange={(value) => setTab(value as "login" | "register")}>
        <Card className="w-[450px] bg-white shadow-xl rounded-lg p-6">
          <CardHeader>
            <CardTitle className="text-3xl text-black">
              {tab === "login" ? "Login" : "Register"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <TabsList className="flex justify-center mb-4">
              <TabsTrigger value="login" className="w-1/2">
                Login
              </TabsTrigger>
              <TabsTrigger value="register" className="w-1/2">
                Register
              </TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <div className="space-y-4">
                <Label htmlFor="login-username" className="text-black">
                  Username
                </Label>
                <Input
                  id="login-username"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-gray-100 text-black border-gray-300"
                />
                <Label htmlFor="login-password" className="text-black">
                  Password
                </Label>
                <Input
                  type="password"
                  id="login-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-gray-100 text-black border-gray-300"
                />
                <Button
                  onClick={handleAuth}
                  className="w-full mt-4 bg-black text-white"
                  disabled={loading}
                >
                  {loading ? <Loader2 className="animate-spin w-5 h-5" /> : "Login"}
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="register">
              <div className="space-y-4">
                <Label htmlFor="register-username" className="text-black">
                  Username
                </Label>
                <Input
                  id="register-username"
                  placeholder="Choose a username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-gray-100 text-black border-gray-300"
                />
                <Label htmlFor="register-password" className="text-black">
                  Password
                </Label>
                <Input
                  type="password"
                  id="register-password"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-gray-100 text-black border-gray-300"
                />
                <Button
                  onClick={handleAuth}
                  className="w-full mt-4 bg-black text-white"
                  disabled={loading}
                >
                  {loading ? <Loader2 className="animate-spin w-5 h-5" /> : "Register"}
                </Button>
              </div>
            </TabsContent>
          </CardContent>
        </Card>
      </Tabs>
    </div>
  );
}
