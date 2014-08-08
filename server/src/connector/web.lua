--
-- Created by IntelliJ IDEA.
-- User: lcc3536
-- Date: 14-8-5
-- Time: 下午4:01
-- To change this template use File | Settings | File Templates.
--

local skynet = require "skynet"
local json = require "cjson"
local socket = require "socket"
local httpd = require "http.httpd"
local urllib = require "http.url"
local sockethelper = require "http.sockethelper"

local function _response(id, ...)
    local ok, err = httpd.write_response(sockethelper.writefunc(id), ...)
    if not ok then
        -- if err == sockethelper.socket_error , that means socket closed.
        skynet.error(string.format("fd = %d, %s", id, err))
    end
end

local function handle(id)
    socket.start(id)
    -- limit request body size to 8192 (you can pass nil to unlimit)
    local code, url, method, header, body = httpd.read_request(sockethelper.readfunc(id), 8192)
    if code then
        if code ~= 200 then
            _response(id, code)
        else
            local tmp = {}

            if header.host then
                table.insert(tmp, string.format("host: %s", header.host))
            end
            local path, query = urllib.parse(url)
            table.insert(tmp, string.format("path: %s", path))
            if query then
                local q = urllib.parse_query(query)
                for k, v in pairs(q) do
                    table.insert(tmp, string.format("query: %s= %s", k, v))
                end
            end
--            _response(id, code, table.concat(tmp, "\n"))
                        _response(id, 200, "hello world")
        end
    else
        if url == sockethelper.socket_error then
            skynet.error("socket closed")
        else
            skynet.error(url)
        end
    end
    socket.close(id)
end

function init(...)
    print("web init", ...)

    local id = socket.listen("0.0.0.0", 8000);
    socket.start(id, function(id, addr)
        print(id, addr)

        handle(id)
    end)
end

function exit(...)
    print("web exit", ...)
end

function accept.ret(...)
    print("accept ret", ...)
end

function response.ret(...)
    print("response ret", ...)
end

