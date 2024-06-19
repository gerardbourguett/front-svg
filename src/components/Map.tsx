"use client";
import { useEffect, useState, useRef } from "react";
import Paths from "./paths";
import * as d3 from "d3";
import CreateModal from "@/components/CreateModal";
import EditModal from "@/components/EditModal";
import {
  loadCircles,
  updateCirclePosition,
  createCircle,
  updateCircleDetails,
  deleteCircle,
} from "../app/utils/utils";
import { toast } from "react-hot-toast";

interface SvgData {
  _id: string;
  cx: number;
  cy: number;
  r: number;
  fill: string;
  description: string;
  ip_address: string;
}

const Map = () => {
  const [data, setData] = useState<SvgData[]>([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [editModalIsOpen, setEditModalIsOpen] = useState(false);
  const [loadButton, setLoadButton] = useState(false);
  const [newCircle, setNewCircle] = useState({
    cx: 0,
    cy: 0,
    description: "",
    ip_address: "",
  });
  const pointsRef = useRef<SVGGElement | null>(null);
  const [idTemp, setIdTemp] = useState("");

  const handleLoadCircles = async () => {
    setLoadButton(true);
    try {
      const circles = await loadCircles();
      setData(circles);
      console.log("Puntos cargados");
    } catch (error) {
      console.error("Error loading points:", error);
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

  const handleDoubleClick = (event: any) => {
    const coords = d3.pointer(event);
    const target = d3.select(event.target);
    const x = coords[0];
    const y = coords[1];
    if (target.node().nodeName === "svg") {
      setNewCircle({ ...newCircle, cx: x, cy: y });
      setModalIsOpen(true);
    } else if (target.node().nodeName === "circle") {
      setNewCircle({
        cx: parseFloat(target.attr("cx")),
        cy: parseFloat(target.attr("cy")),
        description: target.attr("data-description"),
        ip_address: target.attr("data-ip-address"),
      });
      setIdTemp(target.attr("id"));
      setEditModalIsOpen(true);
    }
  };

  const handleModalSubmit = async (description: string, ip_address: string) => {
    const { cx, cy } = newCircle;
    try {
      const data = await createCircle(cx, cy, description, ip_address);
      addCircle(data._id, cx, cy, 10, "blue", description, ip_address);
      toast.success("Punto añadido");
      setModalIsOpen(false);
    } catch (error) {
      toast.error("Error al agregar punto");
      console.error("Error adding circle:", error);
    }
  };

  const handleEditModalSubmit = async (
    circleId: string,
    description: string,
    ip_address: string,
    cx: number,
    cy: number
  ) => {
    try {
      await updateCircleDetails(circleId, cx, cy, description, ip_address);
      setEditModalIsOpen(false); // Cierra el modal
      const updatedData = data.map((circle) =>
        circle._id === circleId
          ? { ...circle, cx, cy, description, ip_address }
          : circle
      );
      setData(updatedData);
      toast.success("Actualización exitosa");
    } catch (error) {
      toast.error("Error al actualizar detalles");
      console.error("Error updating circle details:", error);
    }
  };

  useEffect(() => {
    const svgElement = document.getElementById("svg");
    if (svgElement) {
      svgElement.addEventListener("mousemove", mouseMove);
      svgElement.addEventListener("click", handleDoubleClick);
    }

    return () => {
      if (svgElement) {
        svgElement.removeEventListener("mousemove", mouseMove);
        svgElement.removeEventListener("click", handleDoubleClick);
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

  return (
    <div className="container mx-auto">
      <div className="py-2">
        <div className="p-2"></div>
        Move Mouse Over Shape <span id="txt"></span>
      </div>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={handleLoadCircles}
      >
        Cargar Puntos
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

      <EditModal
        isOpen={editModalIsOpen}
        onRequestClose={() => setEditModalIsOpen(false)}
        onSubmit={handleEditModalSubmit}
        circleId={idTemp}
        cx={newCircle.cx}
        cy={newCircle.cy}
        initialDescription={newCircle.description}
        initialIp_address={newCircle.ip_address}
      />
    </div>
  );
};

export default Map;
