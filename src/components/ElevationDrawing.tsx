import React from 'react';
import { motion } from 'framer-motion';

const STROKE = '#CFE0FA';
const EASE = [0.23, 1, 0.32, 1] as const;

const rect = (x: number, y: number, w: number, h: number) => `M${x} ${y}h${w}v${h}h${-w}Z`;

const buildingPaths = [
rect(150, 250, 288, 90),
rect(162, 242, 312, 8),
rect(162, 162, 312, 80),
rect(153, 152, 330, 10),
rect(162, 268, 156, 72),
'M201 268V340M240 268V340M279 268V340',
rect(370, 271, 33, 69),
rect(222, 180, 195, 39),
'M261 180V219M300 180V219M339 180V219M378 180V219'];


const dimensionPaths = [
'M153 146V112M483 146V112M153 120H483M148 125L158 115M478 125L488 115',
'M150 346V388M438 346V388M150 380H438M145 385L155 375M433 385L443 375',
'M144 340H96M144 250H96M144 152H96M104 340V152M99 345L109 335M99 255L109 245M99 157L109 147'];


const hatch = Array.from({ length: 36 }, (_, i) => `M${44 + i * 16} 354L${56 + i * 16} 342`).join('');

const levels = [
{ y: 340, label: 'FFL +0.00' },
{ y: 250, label: 'L2 +3.30' },
{ y: 152, label: 'T.O. +6.25' }];


export function ElevationDrawing() {
  return (
    <svg
      viewBox="0 0 640 420"
      className="h-auto w-full"
      role="img"
      aria-label="Front elevation drawing of The Meridian with overall dimensions and floor levels">
      
      <motion.g
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
        variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
        fill="none"
        stroke={STROKE}
        strokeLinecap="round">
        
        <motion.path
          d="M40 340H600"
          strokeWidth={1.6}
          variants={{ hidden: { pathLength: 0 }, visible: { pathLength: 1, transition: { duration: 0.3, ease: EASE } } }} />
        
        <motion.path
          d={hatch}
          strokeWidth={0.6}
          strokeOpacity={0.5}
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.25 } } }} />
        
        {buildingPaths.map((d) =>
        <motion.path
          key={d}
          d={d}
          strokeWidth={1.4}
          variants={{ hidden: { pathLength: 0 }, visible: { pathLength: 1, transition: { duration: 0.3, ease: EASE } } }} />

        )}
        {dimensionPaths.map((d) =>
        <motion.path
          key={d}
          d={d}
          strokeWidth={0.8}
          strokeOpacity={0.75}
          variants={{ hidden: { pathLength: 0 }, visible: { pathLength: 1, transition: { duration: 0.3, ease: EASE } } }} />

        )}
        {levels.map((level) =>
        <motion.path
          key={level.y}
          d={`M492 ${level.y}H560`}
          strokeWidth={0.8}
          strokeDasharray="4 4"
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 0.8, transition: { duration: 0.2 } } }} />

        )}
      </motion.g>

      <motion.g
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.25, delay: 0.6 }}
        fill={STROKE}
        fontFamily="IBM Plex Mono, monospace"
        fontSize="11">
        
        <text x="318" y="108" textAnchor="middle">36′-1″</text>
        <text x="294" y="402" textAnchor="middle">31′-6″</text>
        <text x="88" y="298" textAnchor="middle" transform="rotate(-90 88 298)">9′-10″</text>
        <text x="88" y="203" textAnchor="middle" transform="rotate(-90 88 203)">10′-6″</text>
        {levels.map((level) =>
        <text key={level.label} x="566" y={level.y + 4}>
            {level.label}
          </text>
        )}
        <text x="40" y="40" fontSize="12">SOUTH ELEVATION</text>
        <text x="40" y="58" fillOpacity="0.6">THE MERIDIAN · SCALE 1:100</text>
      </motion.g>
    </svg>);

}