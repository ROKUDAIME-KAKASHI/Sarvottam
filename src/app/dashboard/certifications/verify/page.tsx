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
import { Badge } from "@/components/ui/badge";
import {
  ShieldCheck,
  ShieldAlert,
  BadgeCheck,
  CheckCircle2,
  Award,
  Hash,
  Building2,
  Calendar,
  UserCheck,
} from "lucide-react";

const SAMPLE_CODES = [
  { code: "CERT-IFQM-DMAIC-2026", title: "Six Sigma DMAIC Specialist" },
  { code: "CERT-TQM-5022", title: "TQM Lead Assessor" },
  { code: "CERT-ESG-8819", title: "ESG & Carbon Specialist" },
];

export default function CertificateVerificationPortal() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [result, setResult] = useState<{ valid: boolean; message?: string; data?: any } | null>(
    null
  );

  const runVerification = async (targetCode: string) => {
    if (!targetCode) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await verifyCertificate(targetCode);
      setResult(res);
    } catch (error) {
      console.error(error);
      setResult({ valid: false, message: "An error occurred during verification." });
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    runVerification(code);
  };

  const selectSample = (sampleCode: string) => {
    setCode(sampleCode);
    runVerification(sampleCode);
  };

  return (
    <div className="flex-1 space-y-6 p-6 md:p-10 flex flex-col items-center justify-center min-h-[85vh] max-w-4xl mx-auto">
      <div className="text-center space-y-2 mb-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-semibold uppercase tracking-wider">
          <BadgeCheck className="w-3.5 h-3.5" /> JAIN x IFQM Cryptographic Registry
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
          Credential Verification Node
        </h1>
        <p className="text-sm md:text-base text-muted-foreground max-w-xl mx-auto">
          Validate the cryptographic authenticity of industry-recognized certifications, Six Sigma
          green belts, and quality assessor credentials.
        </p>
      </div>

      <Card className="w-full max-w-xl border-border/60 bg-card shadow-sm">
        <form onSubmit={handleVerify}>
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl">Enter Certificate Serial Code</CardTitle>
            <CardDescription>
              Unique identifier stamped on the physical parchment or PDF transcript.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              type="text"
              placeholder="e.g. CERT-IFQM-DMAIC-2026"
              required
              value={code}
              onChange={(e) => setCode(e.target.value.trim().toUpperCase())}
              className="text-center text-lg tracking-widest font-mono h-12 uppercase"
            />

            <div className="pt-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 text-center">
                Test with registered benchmark credentials:
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {SAMPLE_CODES.map((s) => (
                  <button
                    key={s.code}
                    type="button"
                    onClick={() => selectSample(s.code)}
                    className="text-xs font-mono px-3 py-1.5 rounded-lg border border-border/80 bg-muted/40 hover:bg-primary/10 hover:border-primary/40 text-foreground transition-all cursor-pointer"
                  >
                    {s.code}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-2">
            <Button
              type="submit"
              className="w-full h-11 text-base font-semibold"
              disabled={loading || !code}
            >
              {loading ? "Verifying On-Chain..." : "Verify Credential"}
            </Button>
          </CardFooter>
        </form>
      </Card>

      {result && (
        <Card
          className={`w-full max-w-xl border ${
            result.valid
              ? "border-emerald-500/40 bg-emerald-500/[0.03]"
              : "border-red-500/40 bg-red-500/[0.03]"
          } shadow-md overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300`}
        >
          <CardContent className="p-6 md:p-8">
            <div className="flex flex-col items-center text-center space-y-4">
              {result.valid ? (
                <>
                  <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <ShieldCheck className="w-8 h-8" />
                  </div>
                  <div>
                    <Badge className="bg-emerald-600 hover:bg-emerald-600 text-white font-mono text-xs px-2.5 py-0.5 mb-1.5">
                      CRYPTOGRAPHICALLY AUTHENTICATED
                    </Badge>
                    <h3 className="text-2xl font-bold text-foreground">{result.data.title}</h3>
                    {result.data.grade && (
                      <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5">
                        {result.data.grade}
                      </p>
                    )}
                  </div>

                  <div className="w-full text-left bg-card p-5 rounded-xl border border-border/60 shadow-sm space-y-3.5 mt-2">
                    <div className="flex items-start gap-3">
                      <UserCheck className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <div>
                        <span className="text-xs text-muted-foreground uppercase tracking-wide font-medium block">
                          Certified Recipient
                        </span>
                        <span className="text-sm font-semibold text-foreground">
                          {result.data.user?.name ||
                            result.data.user?.email ||
                            "Academic Researcher"}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Award className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <div>
                        <span className="text-xs text-muted-foreground uppercase tracking-wide font-medium block">
                          Program & Track
                        </span>
                        <span className="text-sm font-medium text-foreground">
                          {result.data.program?.name || "Quality Excellence Track"}
                          {result.data.track?.name ? ` — ${result.data.track.name}` : ""}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Building2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <div>
                        <span className="text-xs text-muted-foreground uppercase tracking-wide font-medium block">
                          Issuing Authority
                        </span>
                        <span className="text-sm font-medium text-foreground">
                          {result.data.issuer || "IFQM Quality Council x JAIN University"}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Calendar className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <div>
                        <span className="text-xs text-muted-foreground uppercase tracking-wide font-medium block">
                          Date of Attainment
                        </span>
                        <span className="text-sm font-mono text-foreground">
                          {result.data.issueDate
                            ? new Date(result.data.issueDate).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })
                            : "Active"}
                        </span>
                      </div>
                    </div>

                    {result.data.hashSignature && (
                      <div className="flex items-start gap-3 pt-2 border-t border-border/50">
                        <Hash className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                        <div>
                          <span className="text-xs text-muted-foreground uppercase tracking-wide font-medium block">
                            Ledger Hash Fingerprint
                          </span>
                          <span className="text-xs font-mono text-muted-foreground break-all">
                            {result.data.hashSignature}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-600 dark:text-red-400">
                    <ShieldAlert className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-red-600 dark:text-red-400">
                      Verification Failed
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                      {result.message ||
                        "This serial code does not match any authenticated record in the IFQM registry."}
                    </p>
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
