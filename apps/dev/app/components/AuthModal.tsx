import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useState } from "react";
import { useNavigation, useSearchParams } from "react-router";

type AuthModalProps = {};

export default function AuthModal({}: AuthModalProps) {
  const navigation = useNavigation();
  const [_, setSearchParams] = useSearchParams();
  const [branchCode, setBranchCode] = useState<string>("");
  const [username, setUsername] = useState<string>("");

  const handleSubmit = () => {
    setSearchParams({ branchCode, username });
  };

  return (
    <AlertDialog open>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Verify your identity</AlertDialogTitle>
          <AlertDialogDescription>
            Enter your branch code and username to continue.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-3">
          <div className="space-y-2">
            <Label className="block">Branch Code</Label>
            <Input
              type="text"
              name="branchCode"
              placeholder="eg: 1001"
              value={branchCode}
              onChange={(e) => setBranchCode(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label className="block">Username</Label>
            <Input
              type="text"
              name="username"
              placeholder="eg: hello_world"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
        </div>

        <AlertDialogFooter>
          <Button
            className="w-full"
            onClick={handleSubmit}
            disabled={
              !branchCode || !username || navigation.state === "loading"
            }
          >
            {navigation.state === "loading" ? "Verifying..." : "Verify"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
