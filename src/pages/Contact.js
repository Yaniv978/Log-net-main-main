import React, { useState, useRef, useEffect } from 'react';
import NavBar from '../components/Navbar/NavBar';
import Footer from '../components/Footer';
import { useDocTitle } from '../components/CustomHook';
import axios from 'axios';
import emailjs from '@emailjs/browser';

const api = {
    key: "64e1840d7b35b9c7872cf31651158510",
    base: "https://api.openweathermap.org/data/2.5/",
};

const Contact = () => {
    useDocTitle('Yaniv-home assignment')
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [message, setMessage] = useState('');
    const [code, setCode] = useState('');
    const [toEmail, setToEmail] = useState('');
    const [errors, setErrors] = useState([]);
    const formRef = useRef(null);
    const [error, setError] = useState('');

    const clearErrors = () => {
        setErrors([]);
    };

    const clearInput = () => {
        setFirstName('');
        setLastName('');
        setEmail('');
        setPhone('');
        setMessage('');
        setCode('');
    };

    const [cities] = useState([
        "London", "New York", "Tokyo", "Paris", "Los Angeles", "Beijing", "Moscow", "Istanbul", "Seoul", "Dubai",
        "Toronto", "Rome", "Sydney", "Shanghai", "Berlin", "Madrid", "Mexico City", "São Paulo", "Delhi", "Mumbai",
        "Jakarta", "Cairo", "Bangkok", "Singapore", "Hong Kong", "Kuala Lumpur", "Buenos Aires", "Lagos", "Rio de Janeiro",
        "Chicago", "Osaka", "Chennai", "Bogotá", "Lima", "Hanoi", "Tehran", "Bangalore", "Ho Chi Minh City", "Baghdad"
    ]);
    const [selectedCities, setSelectedCities] = useState([]);
    const [weathers, setWeathers] = useState([]);
    const [showWeather, setShowWeather] = useState(false);
    const [weatherCode, setWeatherCode] = useState("");

    useEffect(() => {
        if (showWeather) {
            const code = weathers.map(weather => formatTemperature(weather.temp)).join("");
            setWeatherCode(code);
            console.log("Weather Code:", code);
        }
    }, [showWeather, weathers]);

    const fetchWeatherData = async () => {
        const randomCities = [];
        while (randomCities.length < 3) {
            const randomIndex = Math.floor(Math.random() * cities.length);
            const randomCity = cities[randomIndex];
            if (!randomCities.includes(randomCity)) {
                randomCities.push(randomCity);
            }
        }
        const weatherData = [];
        for (let city of randomCities) {
            try {
                const response = await fetch(
                    `${api.base}weather?q=${city}&units=metric&APPID=${api.key}`
                );
                const result = await response.json();
                weatherData.push({ name: result.name, temp: Math.ceil(result.main.temp) });
            } catch (error) {
                console.error("Error fetching weather data:", error);
            }
        }
        setWeathers(weatherData);
        setShowWeather(true);
        setSelectedCities(randomCities);
    };

    const formatTemperature = (temperature) => {
        let formattedTemp = Math.ceil(Math.abs(temperature));
        if (formattedTemp < 10) {
            formattedTemp = `0${formattedTemp}`;
        }
        return formattedTemp;
    };

    const handleButtonClick = () => {
        fetchWeatherData();
    };

    const axiosPostData = async () => {
        // Fetch weather data and wait for it to complete
        await fetchWeatherData();

        const postData = { firstName, lastName, email, phone, message, code: weatherCode };
        console.log("Post Data with Weather Code:", postData);
        try {
            const response = await axios.post('http://localhost:4000/contact', postData);
            if (response.status === 200) {
                setError(<p className="success">{response.data}</p>);
            } else {
                setError(<p className="error">Failed to send data.</p>);
            }
        } catch (error) {
            console.error('Error posting data:', error);
            setError(<p className="error">Failed to send data.</p>);
        }
    };


    const sendEmail = (e) => {
        e.preventDefault();
        clearInput();

        const messageWithPrefix = " " + message + "\n" + "your authenticator code-" + weatherCode;
        const form = e.target;
        form.message.value = messageWithPrefix;
        emailjs
            .sendForm('service_fh81whv', 'template_cyajj5t', form, {
                publicKey: 'j55mdGdXTn9ljjPKo',
                to_email: toEmail
            })
            .then(
                () => {
                    console.log('SUCCESS!');
                    window.alert('Check your email, your code is already there');

                },
                (error) => {
                    console.log('FAILED...', error);
                },
            );
    };
    return (
        <>
            <div>
                <NavBar />
            </div>
            <div id='contact' className="flex justify-center items-center mt-8 w-full bg-white py-12 lg:py-24 ">
                <div className="container mx-auto my-8 px-4 lg:px-20" data-aos="zoom-in">
                    <form onSubmit={sendEmail}>
                        <div className="w-full bg-white p-8 my-4 md:px-12 lg:w-9/12 lg:pl-20 lg:pr-40 mr-auto rounded-2xl shadow-2xl">
                            <div className="flex">
                                <h1 className="font-bold text-center lg:text-left text-blue-900  text-4xl">Provide Your Details</h1>
                            </div>
                            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 mt-5">
                                <div>
                                    <input
                                        name="user_name"
                                        className="w-full bg-gray-100 text-gray-900 mt-2 p-3 rounded-lg focus:outline-none focus:shadow-outline"
                                        type="text"
                                        placeholder="First Name*"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        onKeyUp={clearErrors}
                                    />
                                    {errors &&
                                        <p className="text-red-500 text-sm">{errors.first_name}</p>
                                    }
                                </div>

                                {<div>
                                    <input
                                        name="last_name"
                                        className="w-full bg-gray-100 text-gray-900 mt-2 p-3 rounded-lg focus:outline-none focus:shadow-outline"
                                        type="text"
                                        placeholder="Last Name*"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        onKeyUp={clearErrors}
                                    />
                                    {errors &&
                                        <p className="text-red-500 text-sm">{errors.last_name}</p>
                                    }
                                </div>}

                                <div>
                                    <input
                                        name="user_email"
                                        className="w-full bg-gray-100 text-gray-900 mt-2 p-3 rounded-lg focus:outline-none focus:shadow-outline"
                                        type="email"
                                        placeholder="Email*"
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                            setToEmail(e.target.value);
                                        }}
                                        onKeyUp={clearErrors}
                                        required
                                    />
                                    {errors &&
                                        <p className="text-red-500 text-sm">{errors.email}</p>
                                    }
                                </div>

                                {<div>
                                    <input
                                        name="phone_number"
                                        className="w-full bg-gray-100 text-gray-900 mt-2 p-3 rounded-lg focus:outline-none focus:shadow-outline"
                                        type="number"
                                        placeholder="Phone*"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        onKeyUp={clearErrors}
                                    />
                                    {errors &&
                                        <p className="text-red-500 text-sm">{errors.phone_number}</p>
                                    }
                                </div>}
                            </div>
                            <div className="my-4">
                                <textarea
                                    name="message"
                                    placeholder="Message*"
                                    className="w-full h-32 bg-gray-100 text-gray-900 mt-2 p-3 rounded-lg focus:outline-none focus:shadow-outline"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    onKeyUp={clearErrors}
                                ></textarea>
                                {errors &&
                                    <p className="text-red-500 text-sm">{errors.message}</p>
                                }
                            </div>
                            <div className="my-2 w-1/2 lg:w-2/4">
                                <button onClick={axiosPostData} type="submit" id="submitBtn" className="uppercase text-sm font-bold tracking-wide bg-gray-500 hover:bg-blue-900 text-gray-100 p-3 rounded-lg w-full 
                                    focus:outline-none focus:shadow-outline">
                                    Send
                                </button>
                            </div>
                        </div>
                    </form>
                    <div
                        className="w-full  lg:-mt-96 lg:w-2/6 px-8 py-6 ml-auto bg-blue-900 rounded-2xl">
                        <div className="flex flex-col text-white">
                            <div className="flex my-4 w-2/3 lg:w-3/4">
                                <div className="flex flex-col">
                                    <i className="fas fa-map-marker-alt pt-2 pr-2" />
                                </div>
                                <div className="flex flex-col">
                                    <h2 className="text-2xl">Office Address</h2>
                                    <p className="text-gray-400">Ramat Yishai</p>
                                </div>
                            </div>
                            <div className="flex my-4 w-2/3 lg:w-1/2">
                                <div className="flex flex-col">
                                    <i className="fas fa-phone-alt pt-2 pr-2" />
                                </div>
                                <div className="flex flex-col">
                                    <h2 className="text-2xl">Call Me</h2>
                                    <p className="text-gray-400">Tel: 050-2534212</p>
                                    <div className='mt-5'>
                                        <h2 className="text-2xl">Send an E-mail</h2>
                                        <p className="text-gray-400">yanividov12@gmail.com</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex my-4 w-2/3 lg:w-1/2">
                                <a href="https://www.facebook.com/yaniv.idov/" target="_blank" rel="noreferrer" className="rounded-full flex justify-center bg-white h-8 text-blue-900  w-8  mx-1 text-center pt-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className='fill-current font-black hover:animate-pulse'><path d="M13.397 20.997v-8.196h2.765l.411-3.209h-3.176V7.548c0-.926.258-1.56 1.587-1.56h1.684V3.127A22.336 22.336 0 0 0 14.201 3c-2.444 0-4.122 1.492-4.122 4.231v2.355H7.332v3.209h2.753v8.202h3.312z"></path></svg>
                                </a>
                                <a href="https://www.linkedin.com/in/yaniv-idov-767a17225/" target="_blank" rel="noreferrer" className="rounded-full flex justify-center bg-white h-8 text-blue-900  w-8  mx-1 text-center pt-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className='fill-current font-black hover:animate-pulse'><circle cx="4.983" cy="5.009" r="2.188"></circle><path d="M9.237 8.855v12.139h3.769v-6.003c0-1.584.298-3.118 2.262-3.118 1.937 0 1.961 1.811 1.961 3.218v5.904H21v-6.657c0-3.27-.704-5.783-4.526-5.783-1.835 0-3.065 1.007-3.568 1.96h-.051v-1.66H9.237zm-6.142 0H6.87v12.139H3.095z"></path></svg>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default Contact;
