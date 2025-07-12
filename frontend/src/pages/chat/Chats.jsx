"use client"

import { useEffect, useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import axios from "../../util/axiosConfig"
import { toast } from "react-toastify"
import { useUser } from "../../util/UserContext"
import io from "socket.io-client"
import RequestCard from "./RequestCard"

// shadcn components
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Loader2, Send } from "lucide-react"

var socket
const Chats = () => {
  const [showChatHistory, setShowChatHistory] = useState(true)
  const [showRequests, setShowRequests] = useState(null)
  const [requests, setRequests] = useState([])
  const [requestLoading, setRequestLoading] = useState(false)
  const [acceptRequestLoading, setAcceptRequestLoading] = useState(false)

  const [scheduleModalShow, setScheduleModalShow] = useState(false)
  const [requestModalShow, setRequestModalShow] = useState(false)

  // to store selected chat
  const [selectedChat, setSelectedChat] = useState(null)
  // to store chat messages
  const [chatMessages, setChatMessages] = useState([])
  // to store chats
  const [chats, setChats] = useState([])
  const [chatLoading, setChatLoading] = useState(true)
  const [chatMessageLoading, setChatMessageLoading] = useState(false)
  // to store message
  const [message, setMessage] = useState("")

  const [selectedRequest, setSelectedRequest] = useState(null)

  const { user, setUser } = useUser()

  const navigate = useNavigate()

  const [scheduleForm, setScheduleForm] = useState({
    date: "",
    time: "",
  })

  // Ref for auto-scrolling chat
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [chatMessages])

  useEffect(() => {
    fetchChats()
  }, [])

  useEffect(() => {
    socket = io(axios.defaults.baseURL)
    if (user) {
      socket.emit("setup", user)
    }
    socket.on("message recieved", (newMessageRecieved) => {
      console.log("New Message Recieved: ", newMessageRecieved)
      console.log("Selected Chat: ", selectedChat)
      console.log("Selected Chat ID: ", selectedChat?.id)
      console.log("New Message Chat ID: ", newMessageRecieved.chatId._id)
      if (selectedChat && selectedChat.id === newMessageRecieved.chatId._id) {
        setChatMessages((prevState) => [...prevState, newMessageRecieved])
      }
    })
    return () => {
      socket.off("message recieved")
    }
  }, [selectedChat])

  const fetchChats = async () => {
    try {
      setChatLoading(true)
      const tempUser = JSON.parse(localStorage.getItem("userInfo"))
      const { data } = await axios.get("/chat")
      // console.log("Chats", data.data);
      toast.success(data.message)
      if (tempUser?._id) {
        const temp = data.data.map((chat) => {

          return {
            id: chat._id,
            name: chat?.users.find((u) => u?._id !== tempUser?._id).name,
            picture: chat?.users.find((u) => u?._id !== tempUser?._id).picture,
            username: chat?.users.find((u) => u?._id !== tempUser?._id).username,
          }

        })
        setChats(temp)
      }
      // console.log(temp);
    } catch (err) {
      console.log(err)
      if (err?.response?.data?.message) {
        toast.error(err.response.data.message)
        if (err.response.data.message === "Please Login") {
          localStorage.removeItem("userInfo")
          setUser(null)
          await axios.get("/auth/logout")
          navigate("/login")
        }
      } else {
        toast.error("Something went wrong")
      }
    } finally {
      setChatLoading(false)
    }
  }

  const handleScheduleClick = () => {
    setScheduleModalShow(true)
  }

  const handleChatClick = async (chatId) => {
    try {
      setChatMessageLoading(true)
      const { data } = await axios.get(`http://localhost:8000/message/getMessages/${chatId}`)
      setChatMessages(data.data)
      // console.log("Chat Messages:", data.data);
      setMessage("")
      // console.log("Chats: ", chats);
      const chatDetails = chats.find((chat) => chat.id === chatId)
      setSelectedChat(chatDetails)
      // console.log("selectedChat", chatDetails);
      // console.log("Data", data.message);
      socket.emit("join chat", chatId)
      toast.success(data.message)
    } catch (err) {
      console.log(err)
      if (err?.response?.data?.message) {
        toast.error(err.response.data.message)
        if (err.response.data.message === "Please Login") {
          localStorage.removeItem("userInfo")
          setUser(null)
          await axios.get("/auth/logout")
          navigate("/login")
        }
      } else {
        toast.error("Something went wrong")
      }
    } finally {
      setChatMessageLoading(false)
    }
  }

  const sendMessage = async (e) => {
    try {
      socket.emit("stop typing", selectedChat._id)
      if (message === "") {
        toast.error("Message is empty")
        return
      }
      const { data } = await axios.post("/message/sendMessage", { chatId: selectedChat.id, content: message })
      // console.log("after sending message", data);
      socket.emit("new message", data.data)
      setChatMessages((prevState) => [...prevState, data.data])
      setMessage("")
      // console.log("Data", data.message);
      toast.success(data.message)
    } catch (err) {
      console.log(err)
      if (err?.response?.data?.message) {
        toast.error(err.response.data.message)
        if (err.response.data.message === "Please Login") {
          await axios.get("/auth/logout")
          setUser(null)
          localStorage.removeItem("userInfo")
          navigate("/login")
        }
      } else {
        toast.error("Something went wrong")
      }
    }
  }

  const getRequests = async () => {
    try {
      setRequestLoading(true)
      const { data } = await axios.get("/request/getRequests")
      setRequests(data.data)
      console.log(data.data)
      toast.success(data.message)
    } catch (err) {
      console.log(err)
      if (err?.response?.data?.message) {
        toast.error(err.response.data.message)
        if (err.response.data.message === "Please Login") {
          await axios.get("/auth/logout")
          setUser(null)
          localStorage.removeItem("userInfo")
          navigate("/login")
        }
      } else {
        toast.error("Something went wrong")
      }
    } finally {
      setRequestLoading(false)
    }
  }

  const handleTabClick = async (tab) => {
    if (tab === "chat") {
      setShowChatHistory(true)
      setShowRequests(false)
      await fetchChats()
    } else if (tab === "requests") {
      setShowChatHistory(false)
      setShowRequests(true)
      await getRequests()
    }
  }

  const handleRequestClick = (request) => {
    setSelectedRequest(request)
    setRequestModalShow(true)
  }

  const handleRequestAccept = async (e) => {
    console.log("Request accepted")

    try {
      setAcceptRequestLoading(true)
      const { data } = await axios.post("/request/acceptRequest", { requestId: selectedRequest._id })
      console.log(data)
      toast.success(data.message)
      // remove this request from the requests list
      setRequests((prevState) => prevState.filter((request) => request._id !== selectedRequest._id))
    } catch (err) {
      console.log(err)
      if (err?.response?.data?.message) {
        toast.error(err.response.data.message)
        if (err.response.data.message === "Please Login") {
          await axios.get("/auth/logout")
          setUser(null)
          localStorage.removeItem("userInfo")
          navigate("/login")
        }
      } else {
        toast.error("Something went wrong")
      }
    } finally {
      setAcceptRequestLoading(false)
      setRequestModalShow(false)
    }
  }

  const handleRequestReject = async () => {
    console.log("Request rejected")
    try {
      setAcceptRequestLoading(true)
      const { data } = await axios.post("/request/rejectRequest", { requestId: selectedRequest._id })
      console.log(data)
      toast.success(data.message)
      setRequests((prevState) => prevState.filter((request) => request._id !== selectedRequest._id))
    } catch (err) {
      console.log(err)
      if (err?.response?.data?.message) {
        toast.error(err.response.data.message)
        if (err.response.data.message === "Please Login") {
          await axios.get("/auth/logout")
          setUser(null)
          localStorage.removeItem("userInfo")
          navigate("/login")
        }
      } else {
        toast.error("Something went wrong")
      }
    } finally {
      setAcceptRequestLoading(false)
      setRequestModalShow(false)
    }
  }

  return (
    <div className="bg-slate-900 min-h-[90vh] font-sans text-slate-100 border-r border-cyan-600">
      <div className="flex flex-col md:flex-row bg-slate-800">
        {/* Left Sidebar */}
        <div className="w-full md:w-1/3 lg:w-1/4 bg-slate-900 min-h-[90vh]">
          {/* Tabs */}
          <Tabs defaultValue="chat" className="w-full" onValueChange={(value) => handleTabClick(value)}>
            <TabsList className="grid w-full grid-cols-2 bg-slate-800 p-0 rounded-none">
              <TabsTrigger
                value="chat"
                className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white rounded-none py-3"
              >
                Chat History
              </TabsTrigger>
              <TabsTrigger
                value="requests"
                className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white rounded-none py-3"
              >
                Requests
              </TabsTrigger>
            </TabsList>

            <TabsContent value="chat" className="p-0 m-0">
              <ScrollArea className="h-[calc(100vh-56px)] p-4">
                {chatLoading ? (
                  <div className="flex justify-center items-center h-40">
                    <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
                  </div>
                ) : (
                  <div className="space-y-2">
                    {chats.map((chat) => (
                      <Card
                        key={chat.id}
                        className={`cursor-pointer transition-all hover:bg-slate-800 ${
                          selectedChat?.id === chat.id ? "bg-cyan-600 text-white" : "bg-slate-700 text-slate-100"
                        }`}
                        onClick={() => handleChatClick(chat.id)}
                      >
                        <CardContent className="p-4 flex items-center gap-3">
                          <Avatar className="h-10 w-10 border border-slate-600">
                            <AvatarImage src={chat.picture || "https://via.placeholder.com/150"} alt={chat.name} />
                            <AvatarFallback className="bg-slate-800 text-cyan-500">
                              {chat.name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{chat.name}</p>
                            <p className="text-xs opacity-70">@{chat.username}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </TabsContent>

            <TabsContent value="requests" className="p-0 m-0">
              <ScrollArea className="h-[calc(100vh-56px)] p-4">
                {requestLoading ? (
                  <div className="flex justify-center items-center h-40">
                    <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
                  </div>
                ) : (
                  <div className="space-y-2">
                    {requests.map((request) => (
                      <Card
                        key={request.id}
                        className={`cursor-pointer transition-all hover:bg-slate-800 ${
                          selectedRequest?.id === request.id ? "bg-cyan-600 text-white" : "bg-slate-700 text-slate-100"
                        }`}
                        onClick={() => handleRequestClick(request)}
                      >
                        <CardContent className="p-4 flex items-center gap-3">
                          <Avatar className="h-10 w-10 border border-slate-600">
                            <AvatarImage
                              src={request.picture || "https://via.placeholder.com/150"}
                              alt={request.name}
                            />
                            <AvatarFallback className="bg-slate-800 text-cyan-500">
                              {request.name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{request.name}</p>
                            <p className="text-xs opacity-70">@{request.username}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>

        {/* Chat Area */}
        <div className="w-full md:w-2/3 lg:w-3/4 bg-slate-800 min-h-[90vh] flex flex-col">
          {/* Chat Header */}
          {selectedChat && (
            <div className="flex items-center justify-between p-4 border-b border-slate-700 bg-slate-800">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border border-slate-600">
                  <AvatarImage
                    src={selectedChat.picture || "https://via.placeholder.com/150"}
                    alt={selectedChat.name}
                  />
                  <AvatarFallback className="bg-slate-900 text-cyan-500">
                    {selectedChat.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-slate-100">{selectedChat.name}</p>
                  <p className="text-xs text-slate-400">@{selectedChat.username}</p>
                </div>
              </div>
              <Button
                variant="outline"
                className="bg-cyan-600 hover:bg-cyan-700 text-white border-none"
                onClick={handleScheduleClick}
              >
                Request Video Call
              </Button>
            </div>
          )}

          {/* Chat Messages */}
          <div className="flex-1 p-4 overflow-hidden flex flex-col">
            <ScrollArea className="flex-1 pr-4">
              {selectedChat ? (
                chatMessages.length > 0 ? (
                  <div className="space-y-4">
                    {chatMessages.map((message, index) => (
                      <div
                        key={index}
                        className={`flex ${message.sender._id === user._id ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[70%] px-4 py-2 rounded-lg ${
                            message.sender._id === user._id
                              ? "bg-cyan-600 text-white rounded-tr-none"
                              : "bg-slate-700 text-slate-100 rounded-tl-none"
                          }`}
                        >
                          <p>{message.content}</p>
                          <p className="text-xs opacity-70 text-right mt-1">
                            {new Date(message.createdAt || Date.now()).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <p className="text-slate-400">No messages yet. Start a conversation!</p>
                  </div>
                )
              ) : (
                <div className="h-full flex items-center justify-center">
                  {chatMessageLoading ? (
                    <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
                  ) : (
                    <p className="text-slate-400 text-lg">Select a chat to start messaging</p>
                  )}
                </div>
              )}
            </ScrollArea>

            {/* Message Input */}
            {selectedChat && (
              <div className="mt-4 flex gap-2">
                <Input
                  type="text"
                  placeholder="Type your message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-slate-100 focus-visible:ring-cyan-500"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      sendMessage()
                    }
                  }}
                />
                <Button onClick={sendMessage} className="bg-cyan-600 hover:bg-cyan-700">
                  <Send className="h-4 w-4 mr-2" />
                  Send
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Request Modal */}
      <Dialog open={requestModalShow} onOpenChange={setRequestModalShow}>
        <DialogContent className="bg-slate-900 text-slate-100 border-slate-700 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl text-center text-cyan-400">Confirm your choice?</DialogTitle>
          </DialogHeader>

          {selectedRequest && (
            <div className="py-4 flex justify-center">
              <RequestCard
                name={selectedRequest?.name}
                skills={selectedRequest?.skillsProficientAt}
                rating="4"
                picture={selectedRequest?.picture}
                username={selectedRequest?.username}
              />
            </div>
          )}

          <DialogFooter className="flex justify-center gap-4 sm:justify-center">
            <Button
              onClick={handleRequestAccept}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
              disabled={acceptRequestLoading}
            >
              {acceptRequestLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Accept
            </Button>
            <Button onClick={handleRequestReject} variant="destructive" disabled={acceptRequestLoading}>
              {acceptRequestLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Schedule Modal */}
      <Dialog open={scheduleModalShow} onOpenChange={setScheduleModalShow}>
        <DialogContent className="bg-slate-900 text-slate-100 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-xl text-cyan-400">Request a Meeting</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="date" className="text-slate-200">
                Preferred Date
              </Label>
              <Input
                id="date"
                type="date"
                value={scheduleForm.date}
                onChange={(e) => setScheduleForm({ ...scheduleForm, date: e.target.value })}
                className="bg-slate-800 border-slate-700 text-slate-100"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="time" className="text-slate-200">
                Preferred Time
              </Label>
              <Input
                id="time"
                type="time"
                value={scheduleForm.time}
                onChange={(e) => setScheduleForm({ ...scheduleForm, time: e.target.value })}
                className="bg-slate-800 border-slate-700 text-slate-100"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="submit"
              className="bg-cyan-600 hover:bg-cyan-700 text-white"
              onClick={async (e) => {
                e.preventDefault()
                if (scheduleForm.date === "" || scheduleForm.time === "") {
                  toast.error("Please fill all the fields")
                  return
                }

                scheduleForm.username = selectedChat.username
                try {
                  const { data } = await axios.post("/user/sendScheduleMeet", scheduleForm)
                  toast.success("Request mail has been sent successfully!")
                  setScheduleForm({
                    date: "",
                    time: "",
                  })
                  setScheduleModalShow(false)
                } catch (error) {
                  console.log(error)
                  if (error?.response?.data?.message) {
                    toast.error(error.response.data.message)
                    if (error.response.data.message === "Please Login") {
                      localStorage.removeItem("userInfo")
                      setUser(null)
                      await axios.get("/auth/logout")
                      navigate("/login")
                    }
                  } else {
                    toast.error("Something went wrong")
                  }
                }
              }}
            >
              Submit
            </Button>
            <Button variant="destructive" onClick={() => setScheduleModalShow(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Chats
