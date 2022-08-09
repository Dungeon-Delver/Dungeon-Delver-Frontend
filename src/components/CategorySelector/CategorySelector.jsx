import * as React from "react";
import "./CategorySelector.css";
import classNames from "classnames";

export default function CategorySelector({
  selector,
  activeSelector,
  handleOnSelectorPress,
}) {
  const classes = classNames({
    "category-selector": true,
    active: activeSelector === selector,
    inactive: activeSelector !== selector,
  });
  return (
    <li className="category-selector">
      <input
        type="checkbox"
        className={classes}
        id={selector}
        checked={activeSelector === selector}
        onChange={() => handleOnSelectorPress(selector)}
      />
      <label htmlFor={selector}>{selector}</label>
    </li>
  );
}
