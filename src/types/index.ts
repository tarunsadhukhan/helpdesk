export interface LoginCredentials {
  username: string;
  password: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  type_of_user: number; // Instead of role
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
}

export interface Priority {
  id: string;
  name: string;
  value: string;
}

export interface TicketFormData {
  subject: string;
  priority: string;
  problem: string;
  asset: string;
  location: string;
  department: string;
  subasset: string;
  message: string;
}

export interface Problem {
  id: string;
  name: string;
  value: string;
}
/*
export interface Asset {
  id: string;
  name: string;
  value: string;
  image: string;
  codename: string;
}
*/

export interface Asset {
  id: string;
  name: string;
  value: string;
  image: string;
  codename: string;
  description?: string;
  status?: string;
  category?: string;
}


export interface SubAsset {
  id: string;
  name: string;
  value: string;
  image: string;
  codename: string;
}

export interface Location {
  id: string;
  name: string;
  value: string;
}

export interface Department {
  id: string;
  name: string;
  value: string;
  locationId: string;
}

export interface TicketData {
  subject: string;
  priority: string;
  message: string;
  userId: string;
  timestamp: string;
  status: string;
  ticketId: string;
  requesterEmail: string;
  department?: string;
}


export interface TicketDetail {
  id: string;
  subject: string;
  status: string;
  priority: string;
  helpTopic: string;
  department: string;
  createdDate: string;
  lastResponse: string;
  lastMessage: string;
  replies: TicketReply[];
}

export interface TicketReply {
  id: string;
  author: string;
  message: string;
  timestamp: string;
  attachments?: Attachment[];
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  size: string;
}