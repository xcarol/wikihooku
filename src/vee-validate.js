import { extend } from 'vee-validate';
import {
  required, min, max, email, confirmed,
} from 'vee-validate/dist/rules';

extend('confirmed', confirmed);
extend('min', min);
extend('max', max);
extend('email', email);
extend('required', required);
extend('oldPassword', {
  params: ['target'],
  validate(value, x) {
    return value !== x.target;
  },
});
