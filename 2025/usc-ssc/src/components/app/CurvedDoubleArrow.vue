<template>
        <svg width="200" height="250" viewBox="0 0 300 150">
        <!-- Re-usable arrow-head, scaled up -->
        <defs>
            <marker id="arrowHead"
                    viewBox="0 0 12 12"
                    refX="6" refY="6"
                    markerWidth="10" markerHeight="10"
                    orient="auto-start-reverse">
            <path d="M0,0 L12,6 L0,12 Z" fill="black"/>
            </marker>
        </defs>

        <!-- Curved path from (50,100) to (250,100) via control (150,20) -->
        <path d="M 50 100 Q 150 20 250 100"
                fill="none"
                stroke="black"
                stroke-width="2"
                marker-start="url(#arrowHead)"
                marker-end="url(#arrowHead)" />
        </svg>
</template>