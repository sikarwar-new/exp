import React from "react";
import "./Rest.css";

function ChooseUs() {
  return (
    <div className="pt-20 max-w-full pb-20 ">
      <h2 className="text-4xl text-center font-bold mb-10">
        Why Choose Us?
      </h2>
      <div className="max-w-full flex flex-wrap justify-center pl-4 pr-4 ">
        <div className="whyUs">
          <h3>⭐ Curated by Toppers</h3>
          <hr />
          <p>
            Our notes are handpicked from high-scoring seniors who’ve mastered
            the syllabus — so you get tried-and-tested content.
          </p>
        </div>
        <div className="whyUs">
          <h3>💸 Affordable for Every Student</h3>
          <hr />
          <p>
            Pay only for what you need. Get high-quality academic material
            without burning a hole in your pocket.
          </p>
        </div>
        <div className="whyUs">
          <h3>✅ Verified Content</h3>
          <hr />
          <p>
            Quality you can trust. Each upload is reviewed for clarity,
            accuracy, and usefulness — no clutter, just clean notes.
          </p>
        </div>
        <div className="whyUs">
          <h3>⚡ 4. Instant Access</h3>
          <hr />
          <p>
            No delays, no waiting. Download your notes instantly after payment —
            study now, not later.
          </p>
        </div>
        <div className="whyUs">
          <h3>🔍 Easy Search & Filter</h3>
          <hr />
          <p>
            Find exactly what you need. Browse notes by subject, semester,
            course code, or college — all in a few clicks.
          </p>
        </div>
        <div className="whyUs">
          <h3>💼 Earn While You Learn</h3>
          <hr />
          <p>
            Seniors, monetize your effort. Share your notes and get paid. Help
            juniors while boosting your own income.
          </p>
        </div>
      </div>
    </div>
  );
}

export default ChooseUs;
