import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Upload, ArrowLeft, Download, ChevronDown } from 'lucide-react';
import Swal from 'sweetalert2';
import { fetchTicketDetails, updateTicketStatus, submitTicketReplys } from '../services/api';

interface Attachment {
  id: string;
  name: string;
  url: string;
  size: string;
}

interface TicketReply {
  id: string;
  author: string;
  message: string;
  timestamp: string;
  attachments?: Attachment[];
}

interface TicketDetail {
  stats: {
    ticketId: string;
    deptname: string;
    subject: string;
    locaname: string;
    created_date_time: string;
    problem_type_details: string;
    status: string;
    lastproblemdetails: string;
    lastusername: string;
    lastupdated: string;
    priority: string;
  };
  replies: Array<{
    call_login_updated_id: number;
    updproblemdetails: string;
    updated_date_time: string;
    updusername: string;
    call_login_id: number;
    attachments: Attachment[];
    
  }>;
}



const statusOptions = [
  { value: 'open', label: 'Open' },
  { value: 'closed', label: 'Closed' },
  { value: 'deleted', label: 'Delete' }
];

const TicketDetailPage = () => {
  const { ticketPrefix, ticketNumber } = useParams();
  const ticketId = `${ticketPrefix}/${ticketNumber}`;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [ticketDetail, setTicketDetail] = useState<TicketDetail | null>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  
  useEffect(() => {
    const loadTicketDetails = async () => {
      try {
        setLoading(true);
        const data = await fetchTicketDetails(ticketId);
        setTicketDetail(data as TicketDetail);
        console.log(ticketDetail)
      } catch (error) {
        console.error('Error loading ticket details:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load ticket details',
          confirmButtonColor: '#00A3C4'
        });
      } finally {
        setLoading(false);
      }
    };

    loadTicketDetails();
  }, [ticketId]);

  const handleStatusChange = async (newStatus: string) => {
    try {
      // Update the ticket status on the backend
      await updateTicketStatus(ticketId, newStatus);
  
      // Update the status in ticketDetail, ensuring that the nested stats object is also updated
      setTicketDetail((prev) =>
        prev
          ? {
              ...prev,
              stats: {
                ...prev.stats, // Spread the previous stats object
                status: newStatus, // Update only the status
              },
            }
          : null
      );
  
      setShowStatusDropdown(false);
  
      // Show a success message after updating the status
      await Swal.fire({
        icon: 'success',
        title: 'Status Updated',
        text: `Ticket status has been updated to ${newStatus}`,
        confirmButtonColor: '#00A3C4',
      });
    } catch (error) {
      // Show an error message if the status update fails
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to update ticket status',
        confirmButtonColor: '#00A3C4',
      });
    }
  };


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.includes('image/jpeg') && !file.type.includes('image/jpg')) {
        Swal.fire({
          icon: 'error',
          title: 'Invalid file type',
          text: 'Please upload only JPG images',
          confirmButtonColor: '#00A3C4'
        });
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!replyMessage.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please enter a reply messagessss',
        confirmButtonColor: '#00A3C4',
      });
      return;
    }

    if (selectedFile && selectedFile.size > 5 * 1024 * 1024) { // 5MB limit
      Swal.fire({
        icon: 'error',
        title: 'File Too Large',
        text: 'Please select a file smaller than 5MB',
        confirmButtonColor: '#00A3C4',
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append('message', replyMessage);
      if (selectedFile) {
        formData.append('attachment', selectedFile);
      }

      let sts=''
      // Submit the reply
      console.log('1st',formData)
      if (!ticketDetail?.stats.status ) {
        console.log('dhdhhd')
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ticket details are not available.',
          confirmButtonColor: '#00A3C4',
        });
        return;
      }
      sts=ticketDetail?.stats.status
      await submitTicketReplys(ticketId, formData,sts);


      Swal.fire({
        icon: 'success',
        title: 'Reply Submitted',
        text: 'Your reply has been added successfullyss',
        confirmButtonColor: '#00A3C4',
      });

      // Refresh ticket details
      const updatedData = await fetchTicketDetails(ticketId);
      setTicketDetail(updatedData as TicketDetail);

      // Reset the form
      setReplyMessage('');
      setSelectedFile(null);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to submit replyssssss',
        confirmButtonColor: '#00A3C4',
      });
    }
  };

  const handleDownload = async (attachment: Attachment) => {
    try {
      // In production, replace with actual file download logic
      const response = await fetch(attachment.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = attachment.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to download file',
        confirmButtonColor: '#00A3C4'
      });
    }
  };

  if (loading || !ticketDetail) {
    return (
      <div className="max-w-4xl mx-auto flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00A3C4]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back button */}
      <button
        onClick={() => navigate('/my-tickets')}
        className="flex items-center text-[#00A3C4] mb-4 hover:underline"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to Tickets
      </button>

      {/* Breadcrumb */}
      <div className="text-sm mb-6">
        <span className="text-gray-500">You are here: </span>
        <span className="text-[#00A3C4]">My Ticket</span>
        <span className="text-gray-500"> </span>
        <span className="text-gray-700">Check Ticket</span>
      </div>

      {/* Ticket Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-semibold">{ticketDetail.stats.subject}</span>
            <span className="text-gray-500">({ticketId})</span>
          </div>
          <div className="relative">
            <button 
              onClick={() => setShowStatusDropdown(!showStatusDropdown)}
              className="flex items-center px-4 py-2 bg-[#00A3C4] text-white rounded-md hover:bg-[#008CAB] transition-colors"
            >
              Change Status
              <ChevronDown className="w-4 h-4 ml-2" />
            </button>
            {showStatusDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                {statusOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleStatusChange(option.value)}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Satisfaction Rating */}
        <div className="flex items-center mb-6">
          <span className="text-gray-700 mr-2">Overall Satisfaction</span>
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className="w-5 h-5 text-gray-300"
              fill="none"
            />
          ))}
        </div>

        {/* Ticket Details Grid */}
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="font-medium">Status</span>
              <span className="text-orange-500">{ticketDetail.stats.status}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Priority</span>
              <span>{ticketDetail.stats.priority}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Help Topic</span>
              <span>{ticketDetail.stats.problem_type_details}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Last response</span>
              <span>{ticketDetail.stats.lastusername}</span>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="font-medium">Department</span>
              <span>{ticketDetail.stats.deptname}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Created Date</span>
              <span>{ticketDetail.stats.created_date_time}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Last message</span>
              <span>{ticketDetail.stats.lastupdated}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Replies Section */}
      <div className="space-y-6">
        {ticketDetail.replies.map((reply) => (
          <div 
            key={reply.call_login_updated_id}
            className="bg-[#FFFFD4] rounded-lg shadow-md p-6"
          >
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gray-200 rounded-full" />
                <span className="font-medium">{reply.updusername}</span>
              </div>
              <span className="text-sm text-gray-500">{reply.updated_date_time}</span>
            </div>
            <p className="text-gray-700">{reply.updproblemdetails}</p>
            {reply.attachments && reply.attachments.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Attachments:</h4>
                <div className="flex flex-wrap gap-2">
                  {reply.attachments.map((attachment) => (
                    <button
                      key={attachment.id}
                      onClick={() => handleDownload(attachment)}
                      className="flex items-center px-3 py-1 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                    >
                      <Download className="w-4 h-4 mr-2 text-[#00A3C4]" />
                      <span className="text-sm">{attachment.name}</span>
                      <span className="text-xs text-gray-500 ml-2">({attachment.size})</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Reply Form */}
      <div className="bg-white rounded-lg shadow-md p-6 mt-6">
        <h3 className="text-xl font-semibold mb-4">Post Reply</h3>
        <form onSubmit={handleSubmitReply}>
          <textarea
            value={replyMessage}
            onChange={(e) => setReplyMessage(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#00A3C4] mb-4"
            rows={6}
            placeholder="Type your reply here..."
          />
          
          <div className="flex items-center space-x-4 mb-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="file"
                accept=".jpg,.jpeg"
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="flex items-center px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors">
                <Upload className="w-5 h-5 mr-2" />
                <span>{selectedFile ? selectedFile.name : 'Upload JPG'}</span>
              </div>
            </label>
            {selectedFile && (
              <button
                type="button"
                onClick={() => setSelectedFile(null)}
                className="text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            )}
                <button
            type="submit"
            className="bg-[#00A3C4] text-white px-6 py-2 rounded-md hover:bg-[#008CAB] transition-colors"
          >
            Submit Reply
          </button>
          </div>

      
        </form>
      </div>
    </div>
  );
};

export default TicketDetailPage;