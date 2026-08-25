export default async function handler(req, res) {
  // 1. Configure CORS so your frontend is allowed to talk to this backend
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const username = 'skhattar111'; 
  
  // 2. The exact GraphQL query to get your competitive stats
  const query = `
    query userPublicProfile($username: String!) {
      matchedUser(username: $username) {
        submitStats: submitStatsGlobal {
          acSubmissionNum { difficulty count }
        }
      }
      userContestRanking(username: $username) {
        rating globalRanking topPercentage
      }
    }
  `;

  try {
    // 3. Fetch from LeetCode
    const response = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Referer': 'https://leetcode.com'
      },
      body: JSON.stringify({ query, variables: { username } })
    });

    const data = await response.json();
    
    // 4. Send the data back to your HTML frontend
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch LeetCode telemetry' });
  }
}