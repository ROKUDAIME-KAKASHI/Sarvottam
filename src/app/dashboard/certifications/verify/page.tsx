"use client";

import { useState } from "react";
import { verifyCertificate } from "@/lib/actions/certification.actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShieldCheck, ShieldAlert, BadgeCheck } from "lucide-react";

export default function CertificateVerificationPortal() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ valid: boolean; message?: string; data?: unknown } | null>(
    null
  );

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const res = await verifyCertificate(code);
      setResult(res);
    } catch (error) {
      console.error(error);
      setResult({ valid: false, message: "An error occurred during verification." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6 flex flex-col items-center justify-center min-h-[80vh]">
      <Card className="w-full max-w-lg shadow-lg">
        <form onSubmit={handleVerify}>
          <CardHeader className="text-center">
            <div className="mx-auto bg-primary/10 w-16 h-16 flex items-center justify-center rounded-full mb-4">
              <BadgeCheck className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Credential Verification</CardTitle>
            <CardDescription>
              Enter the unique certificate code to verify its authenticity.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Input
              type="text"
              placeholder="e.g. CERT-A1B2C3D4"
              required
              value={code}
              onChange={(e) => setCode(e.target.value.trim().toUpperCase())}
              className="text-center text-lg tracking-widest font-mono"
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={loading || !code}>
              {loading ? "Verifying..." : "Verify Certificate"}
            </Button>
          </CardFooter>
        </form>
      </Card>

      {result && (
        <Card
          className={`w-full max-w-lg mt-4 border-2 ${result.valid ? "border-green-500 bg-green-50/50 dark:bg-green-950/20" : "border-red-500 bg-red-50/50 dark:bg-red-950/20"}`}
        >
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center space-y-4">
              {result.valid ? (
                <>
                  <ShieldCheck className="w-16 h-16 text-green-500" />
                  <div>
                    <h3 className="text-xl font-bold text-green-700 dark:text-green-400">
                      Authentic Certificate
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      This credential is mathematically verified and active.
                    </p>
                  </div>
                  <div className="w-full text-left bg-background p-4 rounded-md border mt-4 space-y-2">
                    <p className="text-sm">
                      <span className="font-semibold">Recipient:</span>{" "}
                      {result.data.user.name || result.data.user.email}
                    </p>
                    <p className="text-sm">
                      <span className="font-semibold">Credential:</span> {result.data.title}
                    </p>
                    {result.data.program && (
                      <p className="text-sm">
                        <span className="font-semibold">Program:</span> {result.data.program.name}
                      </p>
                    )}
                    <p className="text-sm">
                      <span className="font-semibold">Issue Date:</span>{" "}
                      {new Date(result.data.issueDate).toLocaleDateString()}
                    </p>
                    <p className="text-sm">
                      <span className="font-semibold">Issuer:</span> {result.data.issuer}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <ShieldAlert className="w-16 h-16 text-red-500" />
                  <div>
                    <h3 className="text-xl font-bold text-red-700 dark:text-red-400">
                      Verification Failed
                    </h3>
                    <p className="text-sm text-red-600 dark:text-red-300 mt-1">{result.message}</p>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
