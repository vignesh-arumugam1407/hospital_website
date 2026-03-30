export default function handler(request, response) {
  response.status(200).json({
    status: "Backend is running!",
    timestamp: new Date().toISOString(),
  });
}
