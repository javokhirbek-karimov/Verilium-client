import { useState } from "react";

const Community = () => {
  console.log("COMMUNITY COMPONENT");
  const [title, setTitle] = useState<string>("HEllo");
  return (
    <div>
      COMMUNITY{" "}
      <button onClick={() => alert("HELLO MIT")} style={{ margin: "15px" }}>
        PRESS ME
      </button>
    </div>
  );
};

export default Community;
