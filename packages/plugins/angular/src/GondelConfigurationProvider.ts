import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class GondelStateProvider<T extends any> {
  // this is an empty stub which will be overwritten by a custom provider
  public state: T;
}
