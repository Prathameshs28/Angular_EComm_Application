import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from 'src/app/services/http-service/http.service';
import { StorageService } from 'src/app/services/storage/storage.service';

@Component({
  selector: 'app-pay',
  templateUrl: './pay.component.html',
  styleUrls: ['./pay.component.css'],
})
export class PayComponent implements OnInit {
  paySubmit = false;
  cardForm!: FormGroup;
  error: any;
  constructor(
    private fb: FormBuilder,
    private storageService: StorageService,
    private router: Router,
    private http: HttpService,
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute
  ) {}

  orderID: any;
  ngOnInit(): void {


    if (this.storageService.hasPayPermission() === false) {
      this.router.navigate(['cart/cart-items']);
    }

  
    this.creteCardForm();
    this.getLocalRepayOrderID();
  }

  getLocalRepayOrderID() {
    this.orderID = this.storageService.getLoacalRepayOrderID();
    console.log(this.orderID);
  }

  // --------------- paymenet --------------

  creteCardForm() {
    this.cardForm = new FormGroup({
      cardNumber: new FormControl('', [
        Validators.minLength(12),
        Validators.required,
        Validators.pattern('[0-9]{16}'),
      ]),
      expiry: new FormControl('', [
        Validators.required,
        Validators.pattern('^(0[1-9]|1[0-2])/?([0-9]{4}|[0-9]{2})$'),
      ]),
      cvv: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.pattern('[0-9]{3}'),
      ]),
      nameOnCard: new FormControl('', [
        Validators.required,
        Validators.pattern('^[a-zA-Z ]+$'),
      ]),
    });
  }

  // validations for payment form

  showCardNumberError() {
    const cardNumberValue: any = this.cardForm.get('cardNumber');

    if (!this.cardForm.valid && cardNumberValue.touched) {
      if (cardNumberValue.errors?.['required']) {
        return 'Cart number is required';
      }
      if (cardNumberValue.errors?.['minlength']) {
        return 'Card number length should be 12 digit';
      }
      if (cardNumberValue.errors?.['pattern']) {
        return 'Please Enter valid card number';
      }
    }

    if (cardNumberValue.untouched && this.paySubmit) {
      if (cardNumberValue.errors?.['required']) {
        return 'Cart number  is required';
      }
    }

    return '';
  }

  showCardExpiryError() {
    const cardExpiryValue: any = this.cardForm.get('expiry');

    if (!this.cardForm.valid && cardExpiryValue.touched) {
      if (cardExpiryValue.errors?.['required']) {
        return 'Expiry Date is required';
      }
      if (cardExpiryValue.errors?.['minlength']) {
        return 'Date should be valid';
      }
      if (cardExpiryValue.errors?.['pattern']) {
        return 'Please Enter valid date';
      }
    }

    if (cardExpiryValue.untouched && this.paySubmit) {
      if (cardExpiryValue.errors?.['required']) {
        return 'Expiry Date is required';
      }
    }

    return '';
  }

  showCardCvvError() {
    const cardCvvValue: any = this.cardForm.get('cvv');

    if (!this.cardForm.valid && cardCvvValue.touched) {
      if (cardCvvValue.errors?.['required']) {
        return 'CVV is required';
      }
      if (cardCvvValue.errors?.['minlength']) {
        return 'length should be 3 digit';
      }
      if (cardCvvValue.errors?.['pattern']) {
        return 'Please Enter valid CVV';
      }
    }

    if (cardCvvValue.untouched && this.paySubmit) {
      if (cardCvvValue.errors?.['required']) {
        return 'CVV is required';
      }
    }

    return '';
  }

  showCardNameError() {
    const cardNameValue: any = this.cardForm.get('nameOnCard');

    if (!this.cardForm.valid && cardNameValue.touched) {
      if (cardNameValue.errors?.['required']) {
        return 'Name is required';
      }

      if (cardNameValue.errors?.['pattern']) {
        return 'Please enter valid name';
      }
    }

    if (cardNameValue.untouched && this.paySubmit) {
      if (cardNameValue.errors?.['required']) {
        return 'Name is required';
      }
    }

    return '';
  }

  count = 0;

  cardExpiryCtrl: any;

  onKeyCardExpiry(event: any) {
    this.cardExpiryCtrl = this.cardForm.get('expiry');
    

    this.count = event.target.value.length;
    if (this.count == 2) {
      this.cardExpiryCtrl.value += '/';
    

      this.cardForm.patchValue({
        expiry: this.cardExpiryCtrl.value,
      });
    }

    
  }

  pay() {
    this.paySubmit = true;

    this.router.navigate(['cart/pay']);
    if (this.cardForm.valid) {
      const obj = {
        nameOnCard: this.cardForm.value.nameOnCard,
        cardNumber: this.cardForm.value.cardNumber,
        expiry: this.cardForm.value.expiry,
        cvv: this.cardForm.value.cvv,
      };

      console.log('obj: ', obj);

      this.http
        .securePut(
          `shop/orders/confirm/${this.orderID}`,
          this.storageService.getCustomerToken(),
          obj
        )

        .subscribe({
          next: (data: any) => {
          
            localStorage.removeItem('ORDERID');
            this.toastr.success('', 'Payment successful !!!');

            setTimeout(() => {
              this.router.navigate(['self/orders']);
            }, 2000);
          },
          error: (err: any) => {
            this.error = err;
           
            this.toastr.error('', 'Somthing went wrong!');
           
          },
        });
    }
  }

  cancel() {
    localStorage.removeItem('ORDERID');
    this.router.navigate(['']);
  }
}
