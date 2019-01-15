import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from "./home/home.component";
import { ConversationComponent } from "./conversation/conversation.component";

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path:'conversation',component:ConversationComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
