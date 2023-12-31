import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  loginForm!:FormGroup;
  type:string = 'students'
  users:any[] = []

  constructor(private _authService:AuthService ,
     private _router:Router ,
      private _toastr:ToastrService ,
       private _formBuilder:FormBuilder) {
    this.createLogin();
    this.getUsers();
  }

  getRole(event:any) {
    this.type = event.value;
    this.getUsers()
  }

  getUsers() {
    this._authService.getUsers(this.type).subscribe((res:any) => {
      this.users = res
    })
  }

  createLogin() {
    this.loginForm = this._formBuilder.group({
      type: [this.type],
      email : ['' , [Validators.required , Validators.email]],
      password : ['' , [Validators.required]]
    })
  }

  submit() {

    let index = this.users.findIndex(item => item.email == this.loginForm.value.email  && item.password == this.loginForm.value.password)
    if(index == -1) {
      this._toastr.error('الايميل أو كلمه المرور غير صحيحه' , "" , {
        disableTimeOut: false,
        titleClass: "toastr_title",
        messageClass: "toastr_message",
        timeOut:5000,
        closeButton: true,
      })
    } else {
      const model = {
        username:this.users[index].username,
        role:this.type,
        userId:this.users[index].id
      }
      this._authService.login(model).subscribe(res => {

        this._toastr.success('تم تسجيل الدخول بنجاح' , "" , {
          disableTimeOut: false,
          titleClass: "toastr_title",
          messageClass: "toastr_message",
          timeOut:5000,
          closeButton: true,
        })
        this._router.navigate(['/subjects'])
      })
    }
  }

}
