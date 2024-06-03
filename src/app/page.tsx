/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useEffect, useState, useRef } from "react";
import Paths from "./paths";
import * as d3 from "d3";
import CreateModal from "@/components/CreateModal";

interface SvgData {
  _id: string;
  cx: number;
  cy: number;
  r: number;
  fill: string;
  description: string;
  ip_address: string;
}

export default function Home() {
  const [data, setData] = useState<SvgData[]>([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [newCircle, setNewCircle] = useState({
    cx: 0,
    cy: 0,
    description: "",
    ip_address: "",
  });
  const pointsRef = useRef<SVGGElement | null>(null);

  const loadCircles = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/svg");
      const json = await response.json();
      setData(json.svgs);
      console.log("Circles loaded", json.svgs);
    } catch (error) {
      console.error("Error loading circles:", error);
    }
  };

  const mouseMove = (e: MouseEvent) => {
    const coords = d3.pointer(e);
    const x = coords[0];
    const y = coords[1];
    const txtElement = document.getElementById("txt");
    if (txtElement) {
      txtElement.innerHTML = `x: ${x}, y: ${y}`;
    }
  };

  const addCircle = (
    id: string,
    cx: number,
    cy: number,
    r: number,
    fill: string,
    description: string,
    ip_address: string
  ) => {
    const svg = d3.select(pointsRef.current);
    svg
      .append<SVGCircleElement>("circle")
      .attr("id", id)
      .attr("cx", cx)
      .attr("cy", cy)
      .attr("r", r)
      .attr("fill", fill)
      .attr("data-description", description)
      .attr("data-ip-address", ip_address)
      .call(drag);
  };

  // Drag and drop

  const dragstarted = (
    event: d3.D3DragEvent<SVGCircleElement, unknown, unknown>
  ) => {
    d3.select(event.sourceEvent.target)
      .attr("initial-cx", d3.select(event.sourceEvent.target).attr("cx"))
      .attr("initial-cy", d3.select(event.sourceEvent.target).attr("cy"));
  };

  const dragged = (
    event: d3.D3DragEvent<SVGCircleElement, unknown, unknown>
  ) => {
    d3.select(event.sourceEvent.target).attr("cx", event.x).attr("cy", event.y);
  };

  const dragended = (
    event: d3.D3DragEvent<SVGCircleElement, unknown, unknown>
  ) => {
    const target = d3.select(event.sourceEvent.target);
    const cx = parseFloat(target.attr("cx"));
    const cy = parseFloat(target.attr("cy"));
    const circleId = target.attr("id");
    const description = target.attr("data-description");
    const ip_address = target.attr("data-ip-address");
    if (circleId) {
      updateCirclePosition(circleId, cx, cy, description, ip_address);
    }
  };

  const drag = d3
    .drag<SVGCircleElement, unknown>()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended);

  const updateCirclePosition = (
    circleId: string,
    cx: number,
    cy: number,
    description: string,
    ip_address: string
  ) => {
    fetch(`http://localhost:4000/api/svg/${circleId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cx: cx,
        cy: cy,
        description: description,
        ip_address: ip_address,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Circle position updated", data);
      })
      .catch((error) => {
        console.error("Error updating circle position:", error);
      });
  };

  const handleDoubleClick = (event: any) => {
    const coords = d3.pointer(event);
    const x = coords[0];
    const y = coords[1];
    setNewCircle({ ...newCircle, cx: x, cy: y });
    setModalIsOpen(true);
  };

  const handleModalSubmit = (description: string, ip_address: string) => {
    const { cx, cy } = newCircle;
    const r = 10;
    const fill = "blue";

    fetch("http://localhost:4000/api/svg", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "circle",
        cx: cx,
        cy: cy,
        r: r,
        fill: fill,
        description: description,
        ip_address: ip_address,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then((data) => {
        addCircle(data._id, cx, cy, r, fill, description, ip_address);
        console.log("Circle added", data);
        setModalIsOpen(false);
      })
      .catch((error) => {
        console.error("Error adding circle:", error);
      });
  };

  useEffect(() => {
    const svgElement = document.getElementById("svg");
    if (svgElement) {
      svgElement.addEventListener("mousemove", mouseMove);
      svgElement.addEventListener("dblclick", handleDoubleClick);
    }

    return () => {
      if (svgElement) {
        svgElement.removeEventListener("mousemove", mouseMove);
        svgElement.removeEventListener("dblclick", handleDoubleClick);
      }
    };
  }, []);

  useEffect(() => {
    const svg = d3.select(pointsRef.current);
    svg.selectAll("*").remove(); // Clear previous circles
    data.forEach((d) => {
      addCircle(d._id, d.cx, d.cy, d.r, d.fill, d.description, d.ip_address);
    });
  }, [data]);

  useEffect(() => {
    loadCircles();
  }, []);

  return (
    <div className="container mx-auto">
      <div className="py-2">
        Move Mouse Over Shape <span id="txt"></span>
      </div>
      {/* bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded */}
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Ping
      </button>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="700"
        width="700"
        version="1.2"
        viewBox="0 0 912 950"
        id="svg"
      >
        <Paths />
        <g
          id="points"
          ref={pointsRef}
          fill="none"
          strokeWidth="1"
          stroke="blue"
        ></g>
      </svg>
      <CreateModal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        onSubmit={handleModalSubmit}
        cx={newCircle.cx}
        cy={newCircle.cy}
      />
    </div>
  );
}
