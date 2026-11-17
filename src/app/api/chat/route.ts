import { NextResponse } from "next/server";

function generateDomainFallback(userQuery: string, userRole: string, userName: string): string {
  const query = userQuery.toLowerCase();

  if (
    query.includes("six sigma") ||
    query.includes("cpk") ||
    query.includes("cp") ||
    query.includes("dmaic") ||
    query.includes("quality")
  ) {
    return `### Six Sigma & Quality Engineering Intelligence

In the **Sarvottam Ecosystem**, process capability and quality interventions follow standardized statistical frameworks:
- **$C_p$ (Potential Capability):** $\\frac{USL - LSL}{6\\sigma}$ — evaluates dispersion against specification width.
- **$C_{pk}$ (Centering Capability):** $\\min\\left(\\frac{USL - \\mu}{3\\sigma}, \\frac{\\mu - LSL}{3\\sigma}\\right)$ — benchmarks shift away from target mean.
- **DMAIC Methodology:**
  1. **Define:** Charter problem scope, identify Critical-to-Quality (CTQ) parameters, quantify COPQ.
  2. **Measure:** Collect baseline SPC observations and verify gauge repeatability/reproducibility (Gage R&R).
  3. **Analyze:** Root cause isolation with Pareto analysis, Ishikawa fishbone, and ANOVA.
  4. **Improve:** Pilot Design of Experiments (DoE) and mistakeproofing (Poka-Yoke).
  5. **Control:** Statistical Process Control (X-bar & R charts), standard operating procedures, and automated alerts.

💡 *Interactive Tool:* You can run real-time capability evaluations on the [Quality Calculator](/framework).`;
  }

  if (
    query.includes("placement") ||
    query.includes("job") ||
    query.includes("interview") ||
    query.includes("hire") ||
    query.includes("career")
  ) {
    return `### Placements & Career Engineering

The **Sarvottam Placement Node** bridges certified student talent with corporate partners:
- **Active Openings:** Browse industrial fellowships and quality engineer positions at [/dashboard/placements](/dashboard/placements).
- **1-on-1 Mock Interviews:** Schedule technical and behavioral sessions with industry mentors at [/dashboard/placements/mock-interviews](/dashboard/placements/mock-interviews).
- **Portfolio Critique:** Submit GitHub repos, research papers, and case studies for expert evaluation at [/dashboard/placements/portfolio-review](/dashboard/placements/portfolio-review).
- **Fast-Track PPOs:** Students maintaining a verified project score above 85% earn direct interview referrals with IFQM corporate sponsors.`;
  }

  if (
    query.includes("certificate") ||
    query.includes("verify") ||
    query.includes("badge") ||
    query.includes("credential")
  ) {
    return `### Cryptographically Verifiable Credentials

All credentials issued under the **JAIN University x IFQM** charter are verifiable in real-time:
- **Instant Verification:** Validate any certificate serial code at [/dashboard/certifications/verify](/dashboard/certifications/verify).
- **Issued Competencies:**
  - *Certified Lean Six Sigma Green Belt (LSSGB)*
  - *TQM Lead Assessor & Statistical Process Auditor*
  - *Industrial ESG & Carbon Accounting Specialist*
  - *Industry 4.0 Predictive Reliability Analyst*
- **Tamper Evidence:** Stamped with cryptographically verifiable hash signatures and mentor approvals.`;
  }

  if (
    query.includes("project") ||
    query.includes("research") ||
    query.includes("problem") ||
    query.includes("apply")
  ) {
    return `### Collaborative Research & Problem Intake

Sarvottam operates a bidirectional innovation pipeline:
- **Industry Partners:** Register production bottlenecks with PPM defect targets at [/problems](/problems).
- **Faculty Mentors:** Curate cohorts, define project milestones, and sign off on technical reviews at [/dashboard/projects](/dashboard/projects).
- **Student Researchers:** Explore active challenges, form interdisciplinary squads, and submit proposals at [/research](/research).`;
  }

  return `### Sarvottam Ecosystem AI Copilot

Hello **${userName}** (${userRole || "Participant"}). I am the autonomous **Sarvottam AI Copilot**, dedicated to academic-industry excellence.

**Quick Navigation & Active Modules:**
- **Quality Capability Calculator:** [/framework](/framework)
- **Industry Challenge Intake:** [/problems](/problems)
- **Research Project Workspaces:** [/dashboard/projects](/dashboard/projects)
- **Placements & Mock Interviews:** [/dashboard/placements](/dashboard/placements)
- **Verifiable Credential Portal:** [/dashboard/certifications/verify](/dashboard/certifications/verify)
- **Institutional Knowledge Graph:** [/dashboard/knowledge-graph](/dashboard/knowledge-graph)

Ask me anything about Six Sigma indices, project application workflows, placement preparation, or quality auditing!`;
}

export async function POST(req: Request) {
  try {
    const { messages, userContext } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;
    const lastUserMessage =
      [...messages].reverse().find((m: { role: string }) => m.role === "user")?.content || "";
    const userName = userContext?.name || "Participant";
    const userRole = userContext?.role || "STUDENT";

    // Autonomous fallback when external key is not provided
    if (!apiKey) {
      const fallbackReply = generateDomainFallback(lastUserMessage, userRole, userName);
      return NextResponse.json({ reply: fallbackReply });
    }

    // Format messages for Gemini API
    const formattedMessages = messages.map((m: { role: string; content: string }) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content }],
    }));

    const payload = {
      systemInstruction: {
        parts: [
          {
            text: `You are the Sarvottam AI Copilot, an enterprise-grade assistant for the Sarvottam Academic-Industry Ecosystem (JAIN University x IFQM).
Your tone is confident, professional, articulate, and deeply knowledgeable in Total Quality Management (TQM), Six Sigma, Lean, industrial engineering, academic research collaboration, and student career placement.

Current user: ${userName} (Role: ${userRole}). Format with clean GitHub-flavored markdown with structured headers and bullet points.`,
          },
        ],
      },
      contents: formattedMessages,
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 1024,
      },
    };

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      const fallbackReply = generateDomainFallback(lastUserMessage, userRole, userName);
      return NextResponse.json({ reply: fallbackReply });
    }

    const data = await response.json();
    const replyText =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      generateDomainFallback(lastUserMessage, userRole, userName);

    return NextResponse.json({ reply: replyText });
  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json({
      reply:
        "The Sarvottam AI Copilot is currently active in local node mode. Please submit your inquiry again.",
    });
  }
}
