import * as React from "react"
import "./CategorySelector.css"

export default function CategorySelector({ selector, activeSelector, handleOnSelectorPress}) {
    const classes = activeSelector===selector ? "category-selector active" : "category-selector inactive"
    return (
        <li className="category-selector">
            <input type="checkbox" className={classes} id={selector} checked={activeSelector===selector} onChange={() => handleOnSelectorPress(selector)} />
            <label htmlFor={selector}>
                {selector}
            </label>
        </li>)
}