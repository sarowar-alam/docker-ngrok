#!/bin/bash
echo ""
echo "Waiting for ngrok tunnel to start..."

for i in $(seq 1 15); do
  RESPONSE=$(curl -s http://localhost:4040/api/tunnels 2>/dev/null)
  URL=$(echo "$RESPONSE" | grep -o '"public_url":"https://[^"]*"' | head -1 | cut -d'"' -f4)

  if [ -n "$URL" ]; then
    echo ""
    echo "============================================"
    echo "  Live URL: $URL"
    echo "============================================"
    echo ""
    exit 0
  fi

  sleep 1
done

echo "Could not get URL. Check: docker logs demo-ngrok"
