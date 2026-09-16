"use client";

import { useState } from "react";

type Category = "planner" | "performer" | "crew" | "";

type FormData = {
  eventName: string;
  eventType: string;
  startDate: string;
  endDate: string;
  location: string;
  venue: string;
  category: Category;

  planningType: string;
  guestCount: string;

  performanceType: string;
  duration: string;
  fee: string;

  crewType: string;
  crewCount: string;
};

const initialForm: FormData = {
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
};

export default function Home() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialForm);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setMessage("");
  };

  const validateDate = (date: string) => {
    return /^\d{4}-\d{2}-\d{2}$/.test(date);
  };

  const validateStep1 = () => {
    if (!formData.eventName.trim()) {
      setMessage("Please enter the event name.");
      return false;
    }

    if (!formData.eventType) {
      setMessage("Please select an event type.");
      return false;
    }

    if (!formData.startDate) {
      setMessage("Please enter the start date.");
      return false;
    }

    if (!validateDate(formData.startDate)) {
      setMessage("Start date must be in YYYY-MM-DD format.");
      return false;
    }

    if (!formData.endDate) {
      setMessage("Please enter the end date.");
      return false;
    }

    if (!validateDate(formData.endDate)) {
      setMessage("End date must be in YYYY-MM-DD format.");
      return false;
    }

    if (formData.endDate < formData.startDate) {
      setMessage("End date cannot be before start date.");
      return false;
    }

    if (!formData.location.trim()) {
      setMessage("Please enter the location.");
      return false;
    }

    if (!formData.category) {
      setMessage("Please select a category.");
      return false;
    }

    return true;
  };

  const validateStep2 = () => {
    if (formData.category === "planner") {
      if (!formData.planningType) {
        setMessage("Please select the planning type.");
        return false;
      }

      if (!formData.guestCount) {
        setMessage("Please enter the guest count.");
        return false;
      }

      if (Number(formData.guestCount) < 1) {
        setMessage("Guest count must be at least 1.");
        return false;
      }
    }

    if (formData.category === "performer") {
      if (!formData.performanceType) {
        setMessage("Please select the performance type.");
        return false;
      }

      if (!formData.duration.trim()) {
        setMessage("Please enter the performance duration.");
        return false;
      }

      if (!formData.fee) {
        setMessage("Please enter the performer fee.");
        return false;
      }

      if (Number(formData.fee) < 0) {
        setMessage("Fee cannot be negative.");
        return false;
      }
    }

    if (formData.category === "crew") {
      if (!formData.crewType) {
        setMessage("Please select the crew type.");
        return false;
      }

      if (!formData.crewCount) {
        setMessage("Please enter the crew count.");
        return false;
      }

      if (Number(formData.crewCount) < 1) {
        setMessage("Crew count must be at least 1.");
        return false;
      }
    }

    return true;
  };

  const getCategoryDetails = () => {
    if (formData.category === "planner") {
      return {
        planningType: formData.planningType,
        guestCount: formData.guestCount,
      };
    }

    if (formData.category === "performer") {
      return {
        performanceType: formData.performanceType,
        duration: formData.duration,
        fee: formData.fee,
      };
    }

    if (formData.category === "crew") {
      return {
        crewType: formData.crewType,
        crewCount: formData.crewCount,
      };
    }

    return {};
  };

  const getCategoryLabel = () => {
    if (formData.category === "planner") return "Event Planner";
    if (formData.category === "performer") return "Performer";
    if (formData.category === "crew") return "Crew";
    return "";
  };

  const handleNext = () => {
    setMessage("");

    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;

    if (step < 4) {
      setStep((previous) => previous + 1);
    }
  };

  const handleBack = () => {
    setMessage("");

    if (step > 1) {
      setStep((previous) => previous - 1);
    }
  };

  const handleSubmit = async () => {
    setMessage("");

    if (!validateStep1()) {
      setStep(1);
      return;
    }

    if (!validateStep2()) {
      setStep(2);
      return;
    }

    setIsSubmitting(true);

    const requirement = {
      eventName: formData.eventName.trim(),
      eventType: formData.eventType,
      startDate: formData.startDate,
      endDate: formData.endDate,
      location: formData.location.trim(),
      venue: formData.venue.trim(),
      category: formData.category,
      categoryDetails: getCategoryDetails(),
    };

    console.log("Sending requirement:", requirement);

    try {
      const response = await fetch(
      "https://gopratle-backend-kapil.onrender.com/api/requirements",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requirement),
  }
);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            data.error ||
            "Failed to submit requirement."
        );
      }

      console.log("API response:", data);

      setMessage("Requirement submitted successfully!");
      setFormData(initialForm);
      setStep(1);
    } catch (error) {
      console.error("Submission error:", error);

      if (error instanceof Error) {
        setMessage(`Failed to submit requirement: ${error.message}`);
      } else {
        setMessage("Failed to submit requirement.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-10">
      <div className="mx-auto max-w-3xl rounded-2xl bg-white p-6 shadow-lg md:p-8">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Post a Requirement
          </h1>

          <p className="mt-2 text-gray-600">
            Tell us about your event requirement.
          </p>
        </div>

        <div className="mb-10">
          <div className="flex items-center justify-between">
            <ProgressCircle number={1} active={step >= 1} />
            <ProgressLine active={step >= 2} />

            <ProgressCircle number={2} active={step >= 2} />
            <ProgressLine active={step >= 3} />

            <ProgressCircle number={3} active={step >= 3} />
            <ProgressLine active={step >= 4} />

            <ProgressCircle number={4} active={step >= 4} />
          </div>

          <div className="mt-3 flex justify-between text-xs text-gray-500">
            <span>Basics</span>
            <span>Details</span>
            <span>Review</span>
            <span>Submit</span>
          </div>
        </div>

        {message && (
          <div
            className={`mb-6 rounded-lg border p-4 ${
              message.includes("successfully")
                ? "border-green-200 bg-green-50 text-green-700"
                : "border-red-200 bg-red-50 text-red-700"
            }`}
          >
            {message}
          </div>
        )}

        {step === 1 && (
          <section>
            <h2 className="mb-6 text-2xl font-semibold text-gray-900">
              Step 1: Event Basics
            </h2>

            <div className="space-y-5">

              <FormField label="Event Name *">
                <input
                  type="text"
                  name="eventName"
                  value={formData.eventName}
                  onChange={handleChange}
                  placeholder="Enter event name"
                  className={inputClass}
                />
              </FormField>

              <FormField label="Event Type *">
                <select
                  name="eventType"
                  value={formData.eventType}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="">Select event type</option>
                  <option value="Wedding">Wedding</option>
                  <option value="Corporate">Corporate</option>
                  <option value="Birthday">Birthday</option>
                  <option value="Concert">Concert</option>
                  <option value="Festival">Festival</option>
                  <option value="Other">Other</option>
                </select>
              </FormField>

              <FormField label="Start Date *">
                <input
                  type="text"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  placeholder="YYYY-MM-DD"
                  maxLength={10}
                  className={inputClass}
                />
              </FormField>

              <FormField label="End Date *">
                <input
                  type="text"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  placeholder="YYYY-MM-DD"
                  maxLength={10}
                  className={inputClass}
                />
              </FormField>

              <FormField label="Location *">
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Enter city or area"
                  className={inputClass}
                />
              </FormField>

              <FormField label="Venue (Optional)">
                <input
                  type="text"
                  name="venue"
                  value={formData.venue}
                  onChange={handleChange}
                  placeholder="Enter venue name"
                  className={inputClass}
                />
              </FormField>

              <FormField label="Category *">
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="">Select category</option>
                  <option value="planner">Event Planner</option>
                  <option value="performer">Performer</option>
                  <option value="crew">Crew</option>
                </select>
              </FormField>

            </div>
          </section>
        )}

        {step === 2 && (
          <section>
            <h2 className="mb-6 text-2xl font-semibold text-gray-900">
              Step 2: Category Details
            </h2>

            {formData.category === "planner" && (
              <div className="space-y-5">

                <FormField label="Planning Type *">
                  <select
                    name="planningType"
                    value={formData.planningType}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    <option value="">Select planning type</option>
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
                </FormField>

                <FormField label="Expected Guest Count *">
                  <input
                    type="number"
                    name="guestCount"
                    value={formData.guestCount}
                    onChange={handleChange}
                    min="1"
                    placeholder="e.g. 200"
                    className={inputClass}
                  />
                </FormField>

              </div>
            )}

            {formData.category === "performer" && (
              <div className="space-y-5">

                <FormField label="Performance Type *">
                  <select
                    name="performanceType"
                    value={formData.performanceType}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    <option value="">Select performance type</option>
                    <option value="Singer">Singer</option>
                    <option value="DJ">DJ</option>
                    <option value="Band">Band</option>
                    <option value="Dancer">Dancer</option>
                    <option value="Other">Other</option>
                  </select>
                </FormField>

                <FormField label="Performance Duration *">
                  <input
                    type="text"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    placeholder="e.g. 2 hours"
                    className={inputClass}
                  />
                </FormField>

                <FormField label="Budget / Fee *">
                  <input
                    type="number"
                    name="fee"
                    value={formData.fee}
                    onChange={handleChange}
                    min="0"
                    placeholder="Enter fee"
                    className={inputClass}
                  />
                </FormField>

              </div>
            )}

            {formData.category === "crew" && (
              <div className="space-y-5">

                <FormField label="Crew Type *">
                  <select
                    name="crewType"
                    value={formData.crewType}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    <option value="">Select crew type</option>
                    <option value="Security">Security</option>
                    <option value="Technicians">Technicians</option>
                    <option value="Production">Production</option>
                    <option value="Setup Staff">Setup Staff</option>
                    <option value="Other">Other</option>
                  </select>
                </FormField>

                <FormField label="Number of Crew Members *">
                  <input
                    type="number"
                    name="crewCount"
                    value={formData.crewCount}
                    onChange={handleChange}
                    min="1"
                    placeholder="e.g. 10"
                    className={inputClass}
                  />
                </FormField>

              </div>
            )}
          </section>
        )}

        {step === 3 && (
          <section>
            <h2 className="mb-6 text-2xl font-semibold text-gray-900">
              Step 3: Review Requirement
            </h2>

            <div className="space-y-4 rounded-xl bg-gray-50 p-6">

              <ReviewRow label="Event Name" value={formData.eventName} />
              <ReviewRow label="Event Type" value={formData.eventType} />
              <ReviewRow label="Start Date" value={formData.startDate} />
              <ReviewRow label="End Date" value={formData.endDate} />
              <ReviewRow label="Location" value={formData.location} />

              <ReviewRow
                label="Venue"
                value={formData.venue || "Not provided"}
              />

              <ReviewRow
                label="Category"
                value={getCategoryLabel()}
              />

              {formData.category === "planner" && (
                <>
                  <ReviewRow
                    label="Planning Type"
                    value={formData.planningType}
                  />

                  <ReviewRow
                    label="Guest Count"
                    value={formData.guestCount}
                  />
                </>
              )}

              {formData.category === "performer" && (
                <>
                  <ReviewRow
                    label="Performance Type"
                    value={formData.performanceType}
                  />

                  <ReviewRow
                    label="Duration"
                    value={formData.duration}
                  />

                  <ReviewRow
                    label="Fee"
                    value={formData.fee}
                  />
                </>
              )}

              {formData.category === "crew" && (
                <>
                  <ReviewRow
                    label="Crew Type"
                    value={formData.crewType}
                  />

                  <ReviewRow
                    label="Crew Count"
                    value={formData.crewCount}
                  />
                </>
              )}

            </div>
          </section>
        )}

        {step === 4 && (
          <section>
            <h2 className="mb-6 text-2xl font-semibold text-gray-900">
              Step 4: Submit Requirement
            </h2>

            <div className="rounded-xl border border-green-200 bg-green-50 p-6">

              <h3 className="text-xl font-semibold text-green-800">
                Ready to Submit
              </h3>

              <p className="mt-2 text-green-700">
                Your requirement has been reviewed.
                Click the button below to save it.
              </p>

            </div>

            <div className="mt-6 rounded-xl bg-gray-50 p-6">

              <ReviewRow
                label="Event"
                value={formData.eventName}
              />

              <ReviewRow
                label="Category"
                value={getCategoryLabel()}
              />

              <ReviewRow
                label="Location"
                value={formData.location}
              />

              <ReviewRow
                label="Date"
                value={`${formData.startDate} to ${formData.endDate}`}
              />

            </div>
          </section>
        )}

        <div className="mt-8 flex justify-between">

          <button
            type="button"
            onClick={handleBack}
            disabled={step === 1 || isSubmitting}
            className="rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-800 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Back
          </button>

          {step < 4 && (
            <button
              type="button"
              onClick={handleNext}
              disabled={isSubmitting}
              className="rounded-lg bg-blue-600 px-7 py-3 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          )}

          {step === 4 && (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="rounded-lg bg-green-600 px-7 py-3 font-medium text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
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

function FormField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block font-medium text-gray-800">
        {label}
      </label>

      {children}
    </div>
  );
}

function ReviewRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="border-b border-gray-200 pb-3 last:border-b-0">

      <p className="text-sm text-gray-500">
        {label}
      </p>

      <p className="mt-1 font-medium text-gray-900">
        {value}
      </p>

    </div>
  );
}

function ProgressCircle({
  number,
  active,
}: {
  number: number;
  active: boolean;
}) {
  return (
    <div
      className={`flex h-10 w-10 items-center justify-center rounded-full font-semibold ${
        active
          ? "bg-blue-600 text-white"
          : "bg-gray-200 text-gray-500"
      }`}
    >
      {number}
    </div>
  );
}

function ProgressLine({
  active,
}: {
  active: boolean;
}) {
  return (
    <div
      className={`mx-2 h-1 flex-1 rounded ${
        active
          ? "bg-blue-600"
          : "bg-gray-200"
      }`}
    />
  );
}

const inputClass =
  "w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100";