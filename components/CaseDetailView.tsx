"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Star, StarOff } from "lucide-react";
import { Toaster, toast } from "react-hot-toast";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Note {
  content: string;
  date: string;
}

interface Document {
  name: string;
  url: string;
}

interface CaseDetails {
  caseTitle: string;
  caseDesc: string;
  dateOfFile: string;
  courtName: string;
  judgeAssigned: string;
  sectionOrAct: string;
  status: string;
  bookmark: boolean;
  partyName: string;
  partyRole: string;
  partyContact: string;
  partyAddress: string;
  notes?: Note[];
  documents?: Document[];
  eventDate: string;
  eventType: string;
  eventOutcome: string;
  eventDesc: string;
  eventLocation: string;
  partyEmail: string;
}

interface CaseDetailViewProps {
  caseId: string; // Pass `caseId` directly instead of full details
}

export default function CaseDetailView({ caseId }: CaseDetailViewProps) {
  const [caseDetails, setCaseDetails] = useState<CaseDetails | null>(null);
  const [notes, setNotes] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCaseDetails = async () => {
      if (!caseId) {
        console.error("caseId is undefined");
        return;
      }

      try {
        const response = await fetch(`https://dummy-backend-15jt.onrender.com/caseDetails/?lawyerId=12345&caseId=${caseId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Fetched Case Details:", data); // Debugging log
        setCaseDetails(data.message);
        setLoading(false);
        fetchNotes();
      } catch (error) {
        console.error("Error fetching case details:", error);
        toast.error("Failed to fetch case details.");
        setLoading(false);
      }
    };

    fetchCaseDetails();
  }, [caseId]);

  const fetchNotes = async () => {
    if (!caseId) return;
    try {
      const response = await fetch(`https://dummy-backend-15jt.onrender.com/notes/?lawyerId=user123&caseId=case98765`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Fetched Notes Data:", data);
      const fetchedNotes = data.message.notes.map((note: any) => ({
        content: note.noteDesc,
        date: note.noteDate,
      }));
      setCaseDetails((prev) => prev ? { ...prev, notes: fetchedNotes } : null);
    } catch (error) {
      console.error("Error fetching notes:", error);
      toast.error("Failed to fetch notes.");
    }
  };
  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(e.target.value);
  };
 
  const handleAddNote = async () => {
    if (notes.trim() === "") {
      toast.error("Please enter a note.");
      return;
    }
  
    const noteData = {
      lawyerId: "12345", // Replace with the actual `lawyerId`
      caseId, // The `caseId` passed as a prop
      note: notes,
      dateStamp: new Date().toISOString().split("T")[0], // Use ISO format for the date
    };
  
    try {
      // Show loading indicator
      setLoading(true);
  
      const response = await fetch(`https://dummy-backend-15jt.onrender.com/post/new/note`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(noteData),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const savedNote = await response.json();
      
      // Update the local notes state first
      const newNote: Note = {
        content: savedNote.note, 
        date: savedNote.dateStamp, 
      };
      
      setNotes(""); 
      
      // Update caseDetails with the new note
      setCaseDetails((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          notes: prev.notes ? [newNote, ...prev.notes] : [newNote], 
        };
      });
  
      toast.success("Note added successfully!");
    } catch (error) {
      console.error("Error adding note:", error);
      toast.error("Failed to add note. Please try again.");
    } finally {
      setLoading(false); 
    }
  };
  
  
  
  const handleFavoriteToggle = () => {
    setIsFavorite((prev) => !prev); // Toggle favorite status
    toast(
      isFavorite ? "Case removed from favorites" : "Case added to favorites",
      {
        icon: isFavorite ? (
          <StarOff className="text-gray-400" />
        ) : (
          <Star className="text-yellow-500" />
        ),
      }
    );
  };
  

  if (loading) {
    return <p>Loading case data...</p>;
  }

  if (!caseDetails) {
    return <p>No data available for this case.</p>;
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 bg-gray-50">
      <Toaster position="top-right" reverseOrder={false} />

      {/* Case Information */}
      <Card className="w-full shadow-lg border border-black-500">
        <CardHeader className="bg-white">
          <CardTitle className="text-xl flex items-center space-x-2">
            <FileText className="h-6 w-6 text-blue-500" />
            <span>
            {caseDetails.caseTitle} (Status: {caseDetails.status})
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
            <div>
              <Label className="text-gray-600">Client Name</Label>
              <p className="text-lg font-semibold">
                {caseDetails.partyName || "No data to display"}
              </p>
            </div>
            <div>
              <Label className="text-gray-600">Contact Information</Label>
              <p className="text-gray-700">
                Address: {caseDetails.partyAddress || "No data to display"}
              </p>
              <p className="text-gray-700">
                Email: {caseDetails.partyEmail || "No data to display"}
              </p>
              <p className="text-gray-700">
                Phone: {caseDetails.partyContact || "No data to display"}
              </p>
            </div>
            {/* <div>
              <Label className="text-gray-600">Case Type</Label>
              <p className="text-gray-700">
                {caseDetails.caseType || "No data to display"}
              </p>
            </div> */}
            <div>
              <Label className="text-gray-600">Description</Label>
              <p className="text-gray-700">
                {caseDetails.caseDesc || "No data to display"}
              </p>
            </div>
            {/* <div>
              <Label className="text-gray-600">Assigned Lawyer/Team</Label>
              <p className="text-gray-700">
                {caseDetails.assignedLawyer || "No data to display"}
              </p>
            </div> */}

            <div>
              <Label className="text-gray-600">Assigned Judge</Label>
              <p className="text-gray-700">
                {caseDetails.judgeAssigned || "No data to display"}
              </p>
            </div>
            <div>
              <Label className="text-gray-600">Section/Act</Label>
              <p className="text-gray-700">
                {caseDetails.sectionOrAct || "No data to display"}
              </p>
            </div>
            <div>
              <Label className="text-gray-600">Court Name</Label>
              <p className="text-gray-700">
                {caseDetails.courtName || "No data to display"}
              </p>
            </div>
            <div>
              <Label className="text-gray-600">Case Filed Date</Label>
              <p className="text-gray-700">
                {caseDetails.dateOfFile || "No data to display"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notes Section */}
<Card className="w-full shadow-lg border border-gray-200">
  <CardHeader className="bg-white">
    <CardTitle className="text-xl flex items-center space-x-2">
      <FileText className="h-6 w-6 text-orange-500" />
      <span>Notes</span>
    </CardTitle>
  </CardHeader>
  <CardContent>
    {/* Add Note Textarea */}
    <Textarea
      placeholder="Add a note..."
      value={notes}
      onChange={handleNoteChange}
      className="w-full"
    />
    {/* Add Note Button */}
    <Button
      className="mt-4 w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white flex items-center"
      onClick={handleAddNote}
    >
      Add Note
    </Button>

    {/* Existing Notes Section */}
    <div className="mt-6">
      <Label className="font-medium">Existing Notes</Label>
      <ScrollArea className="h-[150px] mt-2">
        {caseDetails?.notes && caseDetails.notes.length > 0 ? (
          caseDetails.notes.map((note, index) => (
            <div key={index} className="mb-4">
              <p className="text-sm text-gray-500">{note.date || "Unknown Date"}</p>
              <p className="text-base text-gray-700">{note.content || "No Content"}</p>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">No notes available.</p>
        )}
      </ScrollArea>
    </div>
  </CardContent>
</Card>

      {/* Documents Section */}
<Card className="w-full shadow-lg border border-gray-200">
  <CardHeader className="bg-white">
    <CardTitle className="text-xl flex items-center space-x-2">
      <FileText className="h-6 w-6 text-purple-500" />
      <span>Documents</span>
    </CardTitle>
  </CardHeader>
  <CardContent>
    <div className="mt-6">
      <Label className="font-medium">Uploaded Documents</Label>
      <ScrollArea className="h-[200px] mt-4">
        {caseDetails?.documents && caseDetails.documents.length > 0 ? (
          caseDetails.documents.map((doc, index) => (
            <div
              key={index}
              className="flex items-center justify-between mb-4"
            >
              <div className="flex items-center space-x-3">
                <FileText className="h-5 w-5 text-gray-500" />
                <a
                  href={doc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-blue-600 hover:underline"
                >
                  {doc.name || "Unnamed Document"}
                </a>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">No documents uploaded.</p>
        )}
      </ScrollArea>
    </div>
  </CardContent>
</Card>

    </div>
  );
}