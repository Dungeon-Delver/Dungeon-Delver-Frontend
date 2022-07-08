import * as React from "react"
import "./CategoryContainer.css"

import CategorySelector from "../CategorySelector/CategorySelector"

export default function CategoryContainer({ category }) {
  console.log(category.activeSelector)
  return (
    <div className={category.category}>
      What {category.category} do you want to play with?
      <div className="experience-options">
        {category.selectors.map(item => (
          <CategorySelector key={item} selector={item} activeSelector={category.activeSelector} handleOnSelectorPress={() => category.setActiveSelector(item)}/>
        ))}
      </div>
    </div>
  )
}