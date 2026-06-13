import { useState } from "react";

const RequestForm = () => {
  const [isRecurring, setIsRecurring] = useState(true);

  return (
    <form className="bg-[#f5f9f3] p-6 sm:p-10 rounded-lg space-y-8 max-w-5xl mx-auto">
      {/* Section 1 */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Tell us about the product you’re looking for</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <input type="text" placeholder="What variety are you looking for?" className="input" />
          <select className="input">
            <option>Conventional</option>
            <option>Organic</option>
          </select>
          <input type="text" placeholder="What grades are you open to?" className="input" />
          <input type="text" placeholder="What pack types are you open to?" className="input" />
          <input type="text" placeholder="What are your preferred pack style?" className="input" />
          <input type="text" placeholder="Any specific instructions?" className="input" />
        </div>
      </div>

      {/* Section 2 */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Tell us about the price & quantity you’re looking for</h2>

        <div className="space-y-4">
          <div className="flex gap-4">
            <button
              type="button"
              className={`btn-toggle ${!isRecurring && "active"}`}
              onClick={() => setIsRecurring(false)}
            >
              One-time Purchase
            </button>
            <button
              type="button"
              className={`btn-toggle ${isRecurring && "active"}`}
              onClick={() => setIsRecurring(true)}
            >
              Recurring purchase
            </button>
          </div>

          <div className="grid md:grid-cols-4 gap-4 items-end">
            <input type="text" placeholder="Quantity" className="input" />
            <select className="input">
              <option>lbs</option>
              <option>kg</option>
            </select>
            <select className="input">
              <option>One time purchase</option>
              <option>Weekly</option>
            </select>
            <input type="date" className="input" />
          </div>

          <div className="grid md:grid-cols-[1fr_auto] gap-4 items-center">
            <input type="text" placeholder="Target price" className="input" />
            <button type="button" className="btn-outline">
              I want to give an exact price
            </button>
          </div>
        </div>
      </div>

      {/* Section 3 */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Tell us about your logistics needs</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <input type="date" placeholder="When do you need suppliers to respond by?" className="input" />
          <select className="input">
            <option>Delivery</option>
            <option>Pick up</option>
          </select>
          <input type="text" placeholder="What is your target price for this produce?" className="input col-span-full" />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-between pt-6">
        <button type="button" className="btn-outline">
          Cancel Request
        </button>
        <button type="submit" className="btn-primary">
          Review Request
        </button>
      </div>
    </form>
  );
};

export default RequestForm;
