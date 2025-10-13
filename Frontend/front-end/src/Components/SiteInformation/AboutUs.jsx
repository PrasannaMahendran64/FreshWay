const AboutUs = () => {
  return (
    <>
      <div>
        <div
          className="relative p-6 h-72 bg-cover bg-center rounded-xl"
          style={{ backgroundImage: "url('AboutUs.jpg')" }}
        >
          {/* Linear gradient overlay */}
          <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-black/80 via-black/70 to-transparent"></div>

          {/* Content */}
          <h1 className="w-full text-4xl font-bold text-white text-center absolute inset-0 flex items-center justify-center">
            About Us
          </h1>
        </div>

         <div className="px-6 md:px-12 lg:px-20 py-12 ">
      <div className="grid lg:grid-cols-2 gap-10 items-center">
        {/* Left Content */}
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Welcome to our <span className="text-green-600">FreshWay</span> shop
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Holistically seize parallel metrics and functional ROI. Seamlessly revolutionize
            error-free internal or organic sources before effective scenarios. Progressively
            incentivize state of the art applications for efficient intellectual capital. 
            Credibly leverage existing distinctive mindshare through cutting-edge schemas.
            Proactively procrastinate team building paradigms coordinate client-centric total
            transparent internal.
          </p>
          <p className="text-gray-600 mt-4 leading-relaxed">
            Dynamically embrace diverse customer service and installed base paradigms.
            Professionally brand flexible alignments and cost effective architectures.
            Enthusiastically incentivize seamless communities with strategic theme areas.
          </p>

          {/* Stats */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-indigo-50 p-6 rounded-xl shadow-sm">
              <h3 className="text-2xl font-extrabold text-gray-900">8K</h3>
              <p className="font-semibold text-gray-800">Lovely Customer</p>
              <p className="text-gray-600 text-sm mt-1">
                Competently productize virtual models without performance.
              </p>
            </div>
            <div className="bg-indigo-50 p-6 rounded-xl shadow-sm">
              <h3 className="text-2xl font-extrabold text-gray-900">10K</h3>
              <p className="font-semibold text-gray-800">Listed Products</p>
              <p className="text-gray-600 text-sm mt-1">
                Dynamically morph team driven partnerships after vertical.
              </p>
            </div>
          </div>
        </div>

        {/* Right Images */}
        <div className="grid grid-cols-2 gap-4">
          <img
            src="Customer shopping.jpg"
            alt="Customer shopping"
            className="rounded-xl w-full h-48 object-cover"
          />
          <img
            src="Fresh vegetables.jpg"
            alt="Fresh vegetables"
            className="rounded-xl w-full h-48 object-cover"
          />
          <img
            src="Basket of groceries.jpg"
            alt="Basket of groceries"
            className="rounded-xl w-full h-48 object-cover"
          />
          <img
            src="Vegetables in store.jpg"
            alt="Vegetables in store"
            className="rounded-xl w-full h-48 object-cover"
          />
        </div>
      </div>
    </div>
    <div className="px-6 md:px-12 lg:px-20 py-12 ">
        <p>Holisticly seize parallel metrics and functional ROI. Seamlessly revolutionize error-free internal or organic sources before effective scenarios. Progressively incentivize state of the art applications for efficient intellectual capital. Credibly leverage existing distinctive mindshare through cutting-edge schemas. Proactively procrastinate team building paradigms coordinate client-centric total transparent internal. Energistically reconceptualize global leadership for high-quality networks. Credibly restore an expanded array of systems rather than accurate results. Collaboratively synergize backend bandwidth without 24/7 functionalities. Credibly utilize proactive ideas whereas cross-media core competencies. Uniquely maximize professional best practices through resource maximizing services. Conveniently architect cross-unit web services for e-business imperatives.

</p><br /><p>Appropriately visualize market-driven data before one-to-one scenarios. Collaboratively productize multifunctional ROI through intuitive supply chains. Enthusiastically seize revolutionary value and process-centric services. Competently harness intuitive information after interoperable markets. Interactively revolutionize future-proof value before granular sources. Dynamically embrace diverse customer service and installed base paradigms. Credibly seize enterprise-wide experiences for end-to-end data. Professionally brand flexible alignments and cost effective architectures. Enthusiastically incentivize seamless communities with seamlessly facilitate revolutionary metrics with strategic theme areas.

</p>
    </div>
      </div>
    </>
  );
};

export default AboutUs;
