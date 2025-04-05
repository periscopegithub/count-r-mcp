# Count-R MCP Server

A simple MCP (Model Context Protocol) server that provides a tool to count occurrences of the letter 'r' in a given word. This repository provides two implementations:
1. TypeScript implementation using Server-Sent Events (SSE)
2. Python implementation using FastAPI and SSE

一个简单的 MCP（Model Context Protocol）服务器，提供计算单词中字母 'r' 出现次数的工具。本仓库提供两种实现方式：
1. 使用 Server-Sent Events (SSE) 的 TypeScript 实现
2. 使用 FastAPI 和 SSE 的 Python 实现

## Features | 功能特点

- Example MCP server implementations in both TypeScript and Python
  TypeScript 和 Python 的 MCP 服务器示例实现
- Simple demonstration tool that counts 'r' occurrences in words
  计算单词中 'r' 出现次数的简单示例工具
- Server-Sent Events (SSE) communication showing real-time MCP capabilities
  通过 Server-Sent Events (SSE) 展示实时 MCP 通信能力

## Server Endpoints | 服务器端点

Once running (using either implementation), the server will be available at:
- Main URL: http://127.0.0.1:5000
- SSE endpoint: http://127.0.0.1:5000/sse

服务器运行后（无论使用哪种实现），可通过以下地址访问：
- 主地址：http://127.0.0.1:5000
- SSE 端点：http://127.0.0.1:5000/sse

## Project Structure | 项目结构

```
count-r-mcp/
├── src/
│   └── server.ts      # TypeScript server implementation | TypeScript 服务器实现
├── server.py          # Python server implementation | Python 服务器实现
├── package.json       # TypeScript project dependencies | TypeScript 项目依赖
├── requirements.txt   # Python dependencies | Python 依赖
├── tsconfig.json     # TypeScript configuration | TypeScript 配置
└── README.md         # This file | 本文件
```

## TypeScript Implementation | TypeScript 实现

### Prerequisites | 前置要求

- Node.js (v16 or higher | v16 或更高版本)
- npm (Node Package Manager | Node 包管理器)

### Quick Start | 快速开始

1. Clone the repository | 克隆仓库:
```bash
git clone https://github.com/yourusername/count-r-mcp.git
cd count-r-mcp
```

2. Install dependencies | 安装依赖:
```bash
npm install
```

3. Build and start the server | 构建并启动服务器:
```bash
npm run build
npm run start
```

### Development | 开发

- `npm run build` - Build the TypeScript code | 构建 TypeScript 代码
- `npm run start` - Start the server | 启动服务器
- `npm run dev` - Build and start the server (development mode) | 构建并启动服务器（开发模式）

## Python Implementation | Python 实现

### Prerequisites | 前置要求

- Python 3.8 or higher | Python 3.8 或更高版本
- pip (Python Package Manager | Python 包管理器)

### Quick Start | 快速开始

1. Clone the repository (if not already done) | 克隆仓库（如果尚未克隆）:
```bash
git clone https://github.com/yourusername/count-r-mcp.git
cd count-r-mcp
```

2. Create and activate a virtual environment | 创建并激活虚拟环境:
```bash
# On Windows | Windows系统
python -m venv venv
venv\Scripts\activate

# On macOS | macOS系统
python3 -m venv venv
source venv/bin/activate
```

3. Install dependencies | 安装依赖:
```bash
pip install -r requirements.txt
```

4. Start the server | 启动服务器:
```bash
python server.py
```

## Connecting to MCP Clients | 连接到 MCP 客户端

You can connect this MCP server to any MCP client. Here are setup instructions for some example clients:

您可以将此 MCP 服务器连接到任何 MCP 客户端。以下是一些示例客户端的设置说明：

### Cherry Studio

1. Navigate to Settings > MCP Servers > Add Servers
   导航到 设置 > MCP 服务器 > 添加服务器
2. Choose "SSE" for "Type"
   "类型" 选择 "SSE"
3. Input "http://127.0.0.1:5000/sse" for "URL"
   "URL" 输入 "http://127.0.0.1:5000/sse"
4. Click "Save"
   点击 "保存"

### Cline

Add the following to your Cline MCP settings file:
将以下内容添加到 Cline MCP 设置文件中：

- Windows: `%APPDATA%\Code\User\globalStorage\saoudrizwan.claude-dev\settings\cline_mcp_settings.json`
- macOS: `~/Library/Application Support/Code/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json`

```json
{
  "mcpServers": {
    "count-r": {
      "autoApprove": [],
      "disabled": false,
      "timeout": 60,
      "url": "http://127.0.0.1:5000/sse",
      "transportType": "sse"
    }
  }
}
```

## Usage | 使用方法

Once connected to any MCP client, you can use the count-r tool to count occurrences of the letter 'r' in words. For example, you can make requests like:

连接到任何 MCP 客户端后，您可以使用 count-r 工具来计算单词中字母 'r' 的出现次数。例如，您可以发起类似以下的请求：

```
Input: How many letter 'r's are there in the word 'strrawberrrrrry'?
Output: There are 8 letter 'r's in the word 'strrawberrrrrry'.
```

## License | 许可证

MIT License - See LICENSE file for details

MIT 许可证 - 详见 LICENSE 文件
