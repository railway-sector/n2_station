import { useEffect, useState } from "react";
import { dateUpdate } from "../Query";
import StationSegmentedList from "./StationSegmentedList";

function Header() {
  const [asOfDate, setAsOfDate] = useState(null);
  useEffect(() => {
    dateUpdate().then((response) => {
      setAsOfDate(response);
    });
  }, []);

  return (
    <>
      <header
        slot="header"
        id="header-title"
        style={{
          display: "flex",
          // width: "100%",
          height: "70px",
          padding: "0 1rem",
          borderColor: "#555555",
          borderStyle: "solid",
          borderWidth: 4,
        }}
      >
        <img
          src="https://EijiGorilla.github.io/Symbols/Projec_Logo/DOTr_Logo_v2.png"
          alt="DOTr Logo"
          height={"55px"}
          width={"55px"}
          style={{
            marginBottom: "auto",
            marginTop: "auto",
          }}
        />
        <b className="headerTitle">N2 Station Structure</b>
        <div className="date">{!asOfDate ? "" : "As of " + asOfDate}</div>

        {/* Segmented List component */}
        <div
          style={{
            marginBottom: "auto",
            marginTop: "auto",
            marginLeft: "auto",
            // marginRight: "40px",
            display: "flex",
          }}
        >
          <div
            style={{
              marginRight: "100px",
              marginBottom: "auto",
              marginTop: "auto",
            }}
          >
            <StationSegmentedList />
          </div>
          <img
            src="https://EijiGorilla.github.io/Symbols/Projec_Logo/GCR LOGO.png"
            alt="GCR Logo"
            height={"50px"}
            width={"75px"}
          />
        </div>
      </header>
    </>
  );
}

export default Header;
