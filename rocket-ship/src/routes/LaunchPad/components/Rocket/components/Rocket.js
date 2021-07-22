import React, { useState, Component } from "react";
import RocketCore from "./RocketCore";

export function FunctionalRocket() {
  // Set init value to 0
  const [initialLaunchTime] = useState(0);

  return <RocketCore initialLaunchTime={initialLaunchTime} />;
}

export class ClassRocket extends Component {
  constructor() {
    super();

    // Set init state to 0
    this.state = {
      initialLaunchTime: 0,
    };
  }

  render() {
    const { initialLaunchTime } = this.state;

    return <RocketCore initialLaunchTime={initialLaunchTime} />;
  }
}
