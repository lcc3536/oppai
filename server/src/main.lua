local skynet = require "skynet"
local snax = require "snax"

skynet.start(function()
    print("server start")

--    skynet.newservice()
    snax.globalservice("connector/web")

    skynet.exit()
end)