import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Member } from '../models/member';
import { PaginatedResult } from '../models/pagination';
import { SetPaginationHeaders, setPaginationResponse } from './paginationHelper';

@Injectable({
  providedIn: 'root'
})
export class LikesService {
  baseUrl = environment.apiUrl;
  private http = inject(HttpClient);
  likeIds = signal<number[]>([]);
  paginatedResult = signal<PaginatedResult<Member[]> | null>(null);

  toggleLike(targetId: number){
    return this.http.post(`${this.baseUrl}likes/${targetId}`, {})
  }

  getLikes(predicate : string,pageNumber: number, pageSize: number){
    let params = SetPaginationHeaders(pageNumber,pageSize);

    params = params.append('predicate', predicate);


    return this.http.get<Member[]>(`${this.baseUrl}likes`, 
      {observe: 'response', params}).subscribe({
        next: response => setPaginationResponse(response,this.paginatedResult)
      })
  }

  getLikeIds(){
    return this.http.get<number[]>(`${this.baseUrl}likes/list`).subscribe({
      next: ids => this.likeIds.set(ids)
    })
  }
}
