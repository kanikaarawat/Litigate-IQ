// components/CommunicationModule.tsx
"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageSquare, Users, ImageIcon, FileText, CalendarDays } from "lucide-react";

export default function CommunicationModule() {
  const [activeTab, setActiveTab] = useState("personal");
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [groupMessages, setGroupMessages] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [files, setFiles] = useState([]);
  const [notes, setNotes] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [newNote, setNewNote] = useState("");

  // Fetch data from APIs on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [personalRes, groupRes, tasksRes, filesRes, notesRes] = await Promise.all([
          fetch("/api/communication/conversations/personal"),
          fetch("/api/communication/conversations/group"),
          fetch("/api/communication/tasks"),
          fetch("/api/communication/files"),
          fetch("/api/communication/notes"),
        ]);

        setMessages((await personalRes.json()) || []);
        setGroupMessages((await groupRes.json()) || []);
        setTasks((await tasksRes.json()) || []);
        setFiles((await filesRes.json()) || []);
        setNotes((await notesRes.json()) || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleSendMessage = async () => {
    if (newMessage.trim() === "") return;

    const endpoint = activeTab === "personal" 
      ? "/api/communication/conversations/personal" 
      : "/api/communication/conversations/group";
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newMessage }),
      });

      const newMsg = await response.json();

      if (activeTab === "personal") {
        setMessages((prev) => [...prev, newMsg]);
      } else {
        setGroupMessages((prev) => [...prev, newMsg]);
      }

      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleAddTask = async () => {
    if (newTask.trim() === "") return;

    try {
      const response = await fetch("/api/communication/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task: newTask }),
      });

      const newTaskItem = await response.json();
      setTasks((prev) => [...prev, newTaskItem]);
      setNewTask("");
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const handleAddNote = async () => {
    if (newNote.trim() === "") return;

    try {
      const response = await fetch("/api/communication/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newNote }),
      });

      const newNoteItem = await response.json();
      setNotes((prev) => [...prev, newNoteItem]);
      setNewNote("");
    } catch (error) {
      console.error("Error adding note:", error);
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 bg-gray-50">
      {/* Communication Module */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center space-x-2">
            <MessageSquare className="h-6 w-6 text-blue-500" />
            <span>Chats</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value)} className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="personal">Personal DMs</TabsTrigger>
              <TabsTrigger value="groups">Group Chats</TabsTrigger>
            </TabsList>

            {/* Personal DMs */}
            <TabsContent value="personal">
              <ScrollArea className="h-64 border rounded-md p-4 mb-4">
                {Array.isArray(messages) && messages.length > 0 ? (
                  messages.map((msg) => (
                    <div key={msg.id} className={`mb-4 ${msg.sender === "You" ? "text-right" : "text-left"}`}>
                      <p className="text-sm font-medium">{msg.sender}</p>
                      <p>{msg.content}</p>
                      <span className="text-xs text-gray-500">{msg.timestamp}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No messages to display.</p>
                )}
              </ScrollArea>
              <div className="flex items-center space-x-2">
                <Textarea
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1 resize-none"
                />
                <Button onClick={handleSendMessage}>Send</Button>
              </div>
            </TabsContent>

            {/* Group Chats */}
            <TabsContent value="groups">
              <ScrollArea className="h-64 border rounded-md p-4 mb-4">
                {Array.isArray(groupMessages) && groupMessages.length > 0 ? (
                  groupMessages.map((msg) => (
                    <div key={msg.id} className={`mb-4 ${msg.sender === "You" ? "text-right" : "text-left"}`}>
                      <p className="text-sm font-medium">{msg.sender}</p>
                      <p>{msg.content}</p>
                      <span className="text-xs text-gray-500">{msg.timestamp}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No group messages to display.</p>
                )}
              </ScrollArea>
              <div className="flex items-center space-x-2">
                <Textarea
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1 resize-none"
                />
                <Button onClick={handleSendMessage}>Send</Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Task Assignment Section */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center space-x-2">
            <CalendarDays className="h-6 w-6 text-purple-500" />
            <span>Task Assignment</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-64 border rounded-md p-4 mb-4">
            {Array.isArray(tasks) && tasks.length > 0 ? (
              tasks.map((task) => (
                <div key={task.id} className="mb-4">
                  <p className="font-medium">{task.task}</p>
                  <p className="text-sm text-gray-500">Assigned to: {task.assignedTo}</p>
                  <p className="text-sm text-gray-500">Due: {task.dueDate}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No tasks to display.</p>
            )}
          </ScrollArea>
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Add new task"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
            />
            <Button onClick={handleAddTask}>Add Task</Button>
          </div>
        </CardContent>
      </Card>

      {/* Collaborative Notes Section */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center space-x-2">
            <FileText className="h-6 w-6 text-teal-500" />
            <span>Collaborative Notes</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-64 border rounded-md p-4 mb-4">
            {Array.isArray(notes) && notes.length > 0 ? (
              notes.map((note) => (
                <div key={note.id} className="mb-4">
                  <p>{note.content}</p>
                  <p className="text-sm text-gray-500">- {note.author}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No notes to display.</p>
            )}
          </ScrollArea>
          <div className="flex items-center space-x-2">
            <Textarea
              placeholder="Add a new note"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              className="flex-1 resize-none"
            />
            <Button onClick={handleAddNote}>Add Note</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}