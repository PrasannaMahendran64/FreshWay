import { useState } from "react";
import { toast } from "react-toastify";
const ContactUs = () => {


    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
        toast.success("🎉 Message Sent successful!");
    };


    return (
        <>

            <div className="">

                <div
                    className="relative p-6 h-72 bg-cover bg-center rounded-xl"
                    style={{ backgroundImage: "url('AboutUs.jpg')" }}
                >
                    {/* Linear gradient overlay */}
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-black/80 via-black/70 to-transparent"></div>

                    {/* Content */}
                    <h1 className="w-full text-4xl font-bold text-white text-center absolute inset-0 flex items-center justify-center">
                        Contact Us
                    </h1>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-5 px-4">
                    {/* Email */}
                    <div className="px-9 py-9 flex flex-col justify-center items-center text-center 
                  shadow-2xl rounded-2xl space-y-4 
                  transition transform duration-300 
                  hover:scale-105 hover:-translate-y-2 hover:shadow-green-300">
                        <img
                            width="60"
                            height="60"
                            src="https://img.icons8.com/ios-glyphs/30/40C057/new-post.png"
                            alt="new-post"

                        />
                        <h1 className="text-2xl font-bold">Email Us</h1>
                        <p>
                            <span className="text-green-500">freshwayshop@gmail.com</span> Interactively grow empowered for
                            process-centric total linkage.
                        </p>
                    </div>

                    {/* Call */}
                    <div className="px-9 py-9 flex flex-col justify-center items-center text-center 
                  shadow-2xl rounded-2xl space-y-4 
                  transition transform duration-300 
                  hover:scale-105 hover:-translate-y-2 hover:shadow-green-300">
                        <img
                            width="60"
                            height="60"
                            src="https://img.icons8.com/ios-filled/50/40C057/phone-disconnected.png"
                            alt="phone-disconnected"

                        />
                        <h1 className="text-2xl font-bold">Call Us</h1>
                        <p>
                            <span className="text-green-500">029-00124667</span> Distinctively disseminate focused solutions
                            clicks-and-mortar ministate
                        </p>
                    </div>

                    {/* Location */}
                    <div className="px-9 py-9 flex flex-col justify-center items-center text-center shadow-2xl rounded-2xl space-y-4 transition transform duration-300 hover:scale-105 hover:-translate-y-2 hover:shadow-green-300">
                        <img
                            width="60"
                            height="60"
                            src="https://img.icons8.com/pastel-glyph/64/40C057/location--v3.png"
                            alt="location--v3"

                        />
                        <h1 className="text-2xl font-bold">Location</h1>
                        <p>
                            Boho One, Bridge Street West, Middlesbrough, <br /> North Yorkshire, TS2 1AE.
                            561-4535 <br /> Nulla LA United States 96522.
                        </p>
                    </div>
                </div>


                <div className="w-full flex flex-col md:flex-row items-center justify-between px-10 py-16 bg-white mt-5">

                    <div className="md:w-1/2 flex justify-center mb-10 md:mb-0"><img src="Contact us.gif" alt="" /></div>

                    
                        <div className="md:w-1/2 w-full">
                            <h2 className="text-3xl font-bold mb-3">
                                For any support just send your query
                            </h2>
                            <p className="text-gray-600 mb-6">
                                Collaboratively promote client-focused convergence vis-a-vis
                                customer-directed alignments via standardized infrastructures.
                            </p>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="flex gap-4">
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Enter Your Name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-1/2 p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
                                        required
                                    />
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Enter Your Email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-1/2 p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
                                        required
                                    />
                                </div>

                                <input
                                    type="text"
                                    name="subject"
                                    placeholder="Enter Your Subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
                                    required
                                />

                                <div>
                                    <label className="block font-semibold mb-1">Message</label>
                                    <textarea
                                        name="message"
                                        rows="4"
                                        placeholder="Write your message here"
                                        value={formData.message}
                                        onChange={handleChange}
                                        className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
                                        required
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-md transition"
                                >
                                    Send Message
                                </button>
                            </form>
                        </div>
                    
                </div>


            </div>



        </>
    )



}
export default ContactUs