import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { PaginatedResult } from '../models/pagination';
import { Message } from '../models/message';
import { SetPaginationHeaders, setPaginationResponse } from './paginationHelper';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  baseUrl = environment.apiUrl;
  private http = inject(HttpClient);
  paginatedResult = signal<PaginatedResult<Message[]> | null>(null);

  getMessages(pageNumber: number, pageSize: number, container:string)
  {
    let params = SetPaginationHeaders(pageNumber,pageSize)

    params = params.append('Container', container)

    return this.http.get<Message[]>(this.baseUrl+ 'messages', {observe: 'response',params})
            .subscribe({
              next: response => setPaginationResponse(response,this.paginatedResult)
            })
  }
  
  getMessageThread(username:string){
    return this.http.get<Message[]>(this.baseUrl+ 'messages/thread/' + username)
  }

  sendMessage(username:string, content:string){
    return this.http.post<Message>(this.baseUrl + 'messages', {recipientUsername: username, content})
  }
  
  deleteMessage(id: number){
    return this.http.delete(this.baseUrl + 'messages/' + id);
  }
  
}
