from mcp.server.fastmcp import FastMCP
import time
import signal
import sys
import uvicorn


# Handle SIGINT (Ctrl+C) gracefully
def signal_handler(sig, frame):
    print("Shutting down server gracefully...")
    sys.exit(0)


signal.signal(signal.SIGINT, signal_handler)

# Create an MCP server with increased timeout
mcp = FastMCP(
    name="count-r",
    host="127.0.0.1",
    port=5000,
    # Add this to make the server more resilient
    timeout=30,  # Increase timeout to 30 seconds
)


# Define our tool
@mcp.tool()
def count_r(word: str) -> int:
    """Count the number of 'r' letters in a given word."""
    try:
        # Add robust error handling
        if not isinstance(word, str):
            return 0
        return word.lower().count("r")
    except Exception as e:
        # Return 0 on any error
        return 0


if __name__ == "__main__":
    try:
        # instead of mcp.run(), expose the ASGI app:
        app = mcp.sse_app()
        # this will serve SSE on http://127.0.0.1:5000/sse
        uvicorn.run(app, host="127.0.0.1", port=5000)
    except Exception as e:
        print(f"Error: {e}")
        # Sleep before exiting to give time for error logs
        time.sleep(5)
