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
import { CalendarDays, FileText, MessageSquare } from "lucide-react";
import { postNewNote } from "@/lib/api/cases";

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
}

interface Task {
  id: string;
  task: string;
  assignedTo: string;
  dueDate: string;
}

interface File {
  id: string;
  name: string;
  url: string;
}

interface Note {
  id: string;
  content: string;
  author: string;
}

export default function CommunicationModule() {
  const [activeTab, setActiveTab] = useState<"personal" | "groups">("personal");
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [groupMessages, setGroupMessages] = useState<Message[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [newTask, setNewTask] = useState("");
  const [newNote, setNewNote] = useState("");
  const [lawyerName, setLawyerName] = useState("Guest");
  const [lawyerId, setLawyerId] = useState("12345");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const response = await fetch(`https://dummy-backend-15jt.onrender.com/user`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setLawyerName(data.name || "Guest");
        setLawyerId(data.lawyerId || "12345");
      } catch (error) {
        console.error("Error fetching user details:", error);
        setLawyerName("Guest");
        setLawyerId("12345");
      } finally {
        setLoading(false);
      }
    };

    const fetchData = async () => {
      try {
        setLoading(true);
        const [personalRes, groupRes, tasksRes, filesRes, notesRes] = await Promise.all([
          fetch(`https://cms-production-3675.up.railway.app/communication/conversations/personal`),
          fetch(`https://cms-production-3675.up.railway.app/communication/conversations/group`),
          fetch(`https://cms-production-3675.up.railway.app/communication/tasks`),
          fetch(`https://cms-production-3675.up.railway.app/communication/files`),
          fetch(`https://cms-production-3675.up.railway.app/communication/notes`),
        ]);

        setMessages((await personalRes.json()) || []);
        setGroupMessages((await groupRes.json()) || []);
        setTasks((await tasksRes.json()) || []);
        setFiles((await filesRes.json()) || []);
        setNotes((await notesRes.json()) || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
    fetchData();
  }, []);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) {
      alert("Please enter a message");
      return;
    }

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

      setNewMessage(""); // Clear input after sending
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleAddTask = async () => {
    if (!newTask.trim()) {
      alert("Please enter a task");
      return;
    }

    try {
      const response = await fetch("/api/communication/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task: newTask }),
      });

      const newTaskItem = await response.json();
      setTasks((prev) => [...prev, newTaskItem]);
      setNewTask(""); // Clear input after adding task
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) {
      alert("Please enter a note");
      return;
    }

    try {
      const response = await postNewNote("78901", "C87654", newNote, "12-2-2024");

      const newNoteItem: Note = {
        id: response.caseId,
        content: response.note,
        author: lawyerName, // Use lawyerName here for the author
      };

      setNotes((prev) => [...prev, newNoteItem]);
      setNewNote(""); // Clear input after adding note
    } catch (error) {
      console.error("Error adding note:", error);
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 bg-gray-50">
      {loading && <div className="text-center">Loading...</div>} {/* Show loading */}
      
      {/* Communication Module */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center space-x-2">
            <MessageSquare className="h-6 w-6 text-blue-500" />
            <span>Chats</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as "personal" | "groups")}
            className="w-full"
          >
            <TabsList className="mb-4">
              <TabsTrigger value="personal">Personal DMs</TabsTrigger>
              <TabsTrigger value="groups">Group Chats</TabsTrigger>
            </TabsList>

            <TabsContent value="personal">
              <ScrollArea className="h-64 border rounded-md p-4 mb-4">
                {messages.length > 0 ? (
                  messages.map((msg) => (
                    <div key={msg.id} className="mb-4 text-left">
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

            <TabsContent value="groups">
              <ScrollArea className="h-64 border rounded-md p-4 mb-4">
                {groupMessages.length > 0 ? (
                  groupMessages.map((msg) => (
                    <div key={msg.id} className="mb-4 text-left">
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
            {tasks.length > 0 ? (
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
            {notes.length > 0 ? (
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
              placeholder="Add a note..."
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
