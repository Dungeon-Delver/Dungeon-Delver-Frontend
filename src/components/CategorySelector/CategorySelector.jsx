import * as React from "react"
import "./CategorySelector.css"

export default function CategorySelector({ selector, activeSelector, handleOnSelectorPress}) {
    const classes = activeSelector===selector ? "category-selector active" : "category-selector inactive"
    return (<div className="category-selector">
        <button className={classes} onClick={() => handleOnSelectorPress(selector)}>{selector}</button>
    </div>)
}