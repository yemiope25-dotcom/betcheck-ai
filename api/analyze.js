export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { slip } = req.body;

  const prompt = `
You are a professional betting risk analyst.

Analyze the following bet slip.

Rules:
- Do NOT give predictions
- Do NOT suggest teams or odds
- Focus only on mistakes and risk

Output:
1. Overall Risk Level
2. Risky Markets Used
3. Odds Structure Issues
4. League Reliability
5. Emotional Betting Signs
6. 3 Rules for Next Time

Bet slip:
${slip}
`;

  const aiRes = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }]
    })
  });

  const data = await aiRes.json();

  res.status(200).json({
    result: data.choices[0].message.content
  });
}
