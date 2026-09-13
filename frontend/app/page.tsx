"use client";

import { useState } from "react";

export default function Home() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    eventName: "",
    eventType: "",
    startDate: "",
    endDate: "",
    location: "",
    venue: "",
    category: "",

    // Planner
    planningType: "",
    guestCount: "",

    // Performer
    performanceType: "",
    duration: "",
    fee: "",

    // Crew
    crewType: "",
    crewCount: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setMessage("");
  };

  const nextStep = () => {
    setMessage("");

    if (step === 1) {
      if (
        !formData.eventName ||
        !formData.eventType ||
        !formData.startDate ||
        !formData.endDate ||
        !formData.location ||
        !formData.category
      ) {
        setMessage("Please fill all required Event Basics fields.");
        return;
      }
    }

    if (step === 2) {
      if (formData.category === "planner") {
        if (!formData.planningType || !formData.guestCount) {
          setMessage("Please complete the planner details.");
          return;
        }
      }

      if (formData.category === "performer") {
        if (
          !formData.performanceType ||
          !formData.duration ||
          !formData.fee
        ) {
          setMessage("Please complete the performer details.");
          return;
        }
      }

      if (formData.category === "crew") {
        if (!formData.crewType || !formData.crewCount) {
          setMessage("Please complete the crew details.");
          return;
        }
      }
    }

    if (step < 4) {
      setStep(step + 1);
    }
  };

  const previousStep = () => {
    setMessage("");

    if (step > 1) {
      setStep(step - 1);
    }
  };

  const submitRequirement = async () => {
    setIsSubmitting(true);
    setMessage("");

    const categoryDetails = {
      ...(formData.category === "planner" && {
        planningType: formData.planningType,
        guestCount: formData.guestCount,
      }),

      ...(formData.category === "performer" && {
        performanceType: formData.performanceType,
        duration: formData.duration,
        fee: formData.fee,
      }),

      ...(formData.category === "crew" && {
        crewType: formData.crewType,
        crewCount: formData.crewCount,
      }),
    };

    try {
      const response = await fetch(
        "http://localhost:5000/api/requirements",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            eventName: formData.eventName,
            eventType: formData.eventType,
            startDate: formData.startDate,
            endDate: formData.endDate,
            location: formData.location,
            venue: formData.venue,
            category: formData.category,
            categoryDetails,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to submit requirement"
        );
      }

      console.log("API response:", data);

      setMessage("Requirement submitted successfully!");

      setFormData({
        eventName: "",
        eventType: "",
        startDate: "",
        endDate: "",
        location: "",
        venue: "",
        category: "",

        planningType: "",
        guestCount: "",

        performanceType: "",
        duration: "",
        fee: "",

        crewType: "",
        crewCount: "",
      });

      setStep(1);
    } catch (error) {
      console.error("Submission error:", error);

      setMessage(
        "Failed to submit requirement. Please make sure the backend is running."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-10">
      <div className="mx-auto max-w-2xl rounded-xl bg-white p-8 shadow-md">

        {/* Header */}
        <h1 className="mb-2 text-3xl font-bold text-gray-900">
          Post a Requirement
        </h1>

        <p className="mb-8 text-gray-600">
          Tell us about your event requirement.
        </p>

        {/* Progress */}
        <div className="mb-8 flex items-center justify-between">
          {[1, 2, 3, 4].map((number) => (
            <div
              key={number}
              className={`flex h-10 w-10 items-center justify-center rounded-full font-semibold ${
                step >= number
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              {number}
            </div>
          ))}
        </div>

        {/* Message */}
        {message && (
          <div
            className={`mb-6 rounded-lg p-4 ${
              message.includes("successfully")
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {message}
          </div>
        )}

        {/* STEP 1 */}
        {step === 1 && (
          <section>
            <h2 className="mb-6 text-2xl font-semibold">
              Step 1: Event Basics
            </h2>

            <div className="space-y-5">

              {/* Event Name */}
              <div>
                <label className="mb-2 block font-medium">
                  Event Name *
                </label>

                <input
                  type="text"
                  name="eventName"
                  value={formData.eventName}
                  onChange={handleChange}
                  placeholder="Enter event name"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              {/* Event Type */}
              <div>
                <label className="mb-2 block font-medium">
                  Event Type *
                </label>

                <select
                  name="eventType"
                  value={formData.eventType}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                >
                  <option value="">
                    Select event type
                  </option>

                  <option value="Wedding">
                    Wedding
                  </option>

                  <option value="Corporate">
                    Corporate
                  </option>

                  <option value="Birthday">
                    Birthday
                  </option>

                  <option value="Concert">
                    Concert
                  </option>

                  <option value="Festival">
                    Festival
                  </option>

                  <option value="Other">
                    Other
                  </option>
                </select>
              </div>

              {/* Dates */}
              <div className="grid gap-5 md:grid-cols-2">

                <div>
                  <label className="mb-2 block font-medium">
                    Start Date *
                  </label>

                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block font-medium">
                    End Date *
                  </label>

                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                  />
                </div>

              </div>

              {/* Location */}
              <div>
                <label className="mb-2 block font-medium">
                  Location *
                </label>

                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="City or area"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              {/* Venue */}
              <div>
                <label className="mb-2 block font-medium">
                  Venue{" "}
                  <span className="text-gray-400">
                    (Optional)
                  </span>
                </label>

                <input
                  type="text"
                  name="venue"
                  value={formData.venue}
                  onChange={handleChange}
                  placeholder="Venue name"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              {/* Category */}
              <div>
                <label className="mb-2 block font-medium">
                  Category *
                </label>

                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                >
                  <option value="">
                    Select category
                  </option>

                  <option value="planner">
                    Event Planner
                  </option>

                  <option value="performer">
                    Performer
                  </option>

                  <option value="crew">
                    Crew
                  </option>
                </select>
              </div>

            </div>
          </section>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <section>
            <h2 className="mb-6 text-2xl font-semibold">
              Step 2: Category Details
            </h2>

            {/* PLANNER */}
            {formData.category === "planner" && (
              <div className="space-y-5">

                <div>
                  <label className="mb-2 block font-medium">
                    Planning Type *
                  </label>

                  <select
                    name="planningType"
                    value={formData.planningType}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3"
                  >
                    <option value="">
                      Select planning type
                    </option>

                    <option value="Full Event Planning">
                      Full Event Planning
                    </option>

                    <option value="Partial Planning">
                      Partial Planning
                    </option>

                    <option value="Day Of Coordination">
                      Day Of Coordination
                    </option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block font-medium">
                    Expected Guest Count *
                  </label>

                  <input
                    type="number"
                    name="guestCount"
                    value={formData.guestCount}
                    onChange={handleChange}
                    placeholder="e.g. 200"
                    min="1"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3"
                  />
                </div>

              </div>
            )}

            {/* PERFORMER */}
            {formData.category === "performer" && (
              <div className="space-y-5">

                <div>
                  <label className="mb-2 block font-medium">
                    Performance Type *
                  </label>

                  <select
                    name="performanceType"
                    value={formData.performanceType}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3"
                  >
                    <option value="">
                      Select performance type
                    </option>

                    <option value="Singer">
                      Singer
                    </option>

                    <option value="DJ">
                      DJ
                    </option>

                    <option value="Band">
                      Band
                    </option>

                    <option value="Dancer">
                      Dancer
                    </option>

                    <option value="Other">
                      Other
                    </option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block font-medium">
                    Performance Duration *
                  </label>

                  <input
                    type="text"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    placeholder="e.g. 2 hours"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3"
                  />
                </div>

                <div>
                  <label className="mb-2 block font-medium">
                    Budget / Fee *
                  </label>

                  <input
                    type="number"
                    name="fee"
                    value={formData.fee}
                    onChange={handleChange}
                    placeholder="Enter budget"
                    min="0"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3"
                  />
                </div>

              </div>
            )}

            {/* CREW */}
            {formData.category === "crew" && (
              <div className="space-y-5">

                <div>
                  <label className="mb-2 block font-medium">
                    Crew Type *
                  </label>

                  <select
                    name="crewType"
                    value={formData.crewType}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3"
                  >
                    <option value="">
                      Select crew type
                    </option>

                    <option value="Security">
                      Security
                    </option>

                    <option value="Technicians">
                      Technicians
                    </option>

                    <option value="Production">
                      Production
                    </option>

                    <option value="Setup Staff">
                      Setup Staff
                    </option>

                    <option value="Other">
                      Other
                    </option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block font-medium">
                    Number of Crew Members *
                  </label>

                  <input
                    type="number"
                    name="crewCount"
                    value={formData.crewCount}
                    onChange={handleChange}
                    placeholder="e.g. 10"
                    min="1"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3"
                  />
                </div>

              </div>
            )}
          </section>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <section>
            <h2 className="mb-6 text-2xl font-semibold">
              Step 3: Review Details
            </h2>

            <div className="space-y-4 rounded-lg bg-gray-50 p-5">

              <div>
                <p className="text-sm text-gray-500">
                  Event Name
                </p>

                <p className="font-medium">
                  {formData.eventName}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Event Type
                </p>

                <p className="font-medium">
                  {formData.eventType}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Date
                </p>

                <p className="font-medium">
                  {formData.startDate} to {formData.endDate}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Location
                </p>

                <p className="font-medium">
                  {formData.location}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Venue
                </p>

                <p className="font-medium">
                  {formData.venue || "Not provided"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Category
                </p>

                <p className="font-medium capitalize">
                  {formData.category}
                </p>
              </div>

              {/* Planner Review */}
              {formData.category === "planner" && (
                <>
                  <div>
                    <p className="text-sm text-gray-500">
                      Planning Type
                    </p>

                    <p className="font-medium">
                      {formData.planningType}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">
                      Guest Count
                    </p>

                    <p className="font-medium">
                      {formData.guestCount}
                    </p>
                  </div>
                </>
              )}

              {/* Performer Review */}
              {formData.category === "performer" && (
                <>
                  <div>
                    <p className="text-sm text-gray-500">
                      Performance Type
                    </p>

                    <p className="font-medium">
                      {formData.performanceType}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">
                      Duration
                    </p>

                    <p className="font-medium">
                      {formData.duration}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">
                      Budget / Fee
                    </p>

                    <p className="font-medium">
                      {formData.fee}
                    </p>
                  </div>
                </>
              )}

              {/* Crew Review */}
              {formData.category === "crew" && (
                <>
                  <div>
                    <p className="text-sm text-gray-500">
                      Crew Type
                    </p>

                    <p className="font-medium">
                      {formData.crewType}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">
                      Crew Count
                    </p>

                    <p className="font-medium">
                      {formData.crewCount}
                    </p>
                  </div>
                </>
              )}

            </div>
          </section>
        )}

        {/* STEP 4 */}
        {step === 4 && (
          <section>
            <h2 className="mb-6 text-2xl font-semibold">
              Step 4: Submit Requirement
            </h2>

            <div className="rounded-lg bg-green-50 p-5">
              <p className="font-medium text-green-700">
                Your requirement is ready to be submitted.
              </p>

              <p className="mt-2 text-sm text-green-600">
                Click the submit button below to save it to MongoDB.
              </p>
            </div>
          </section>
        )}

        {/* Navigation */}
        <div className="mt-8 flex justify-between">

          <button
            onClick={previousStep}
            disabled={step === 1 || isSubmitting}
            className="rounded-lg border border-gray-300 px-6 py-3 font-medium disabled:cursor-not-allowed disabled:opacity-40"
          >
            Back
          </button>

          {step < 4 && (
            <button
              onClick={nextStep}
              disabled={isSubmitting}
              className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              Next
            </button>
          )}

          {step === 4 && (
            <button
              onClick={submitRequirement}
              disabled={isSubmitting}
              className="rounded-lg bg-green-600 px-6 py-3 font-medium text-white hover:bg-green-700 disabled:opacity-50"
            >
              {isSubmitting
                ? "Submitting..."
                : "Submit Requirement"}
            </button>
          )}

        </div>
      </div>
    </main>
  );
}