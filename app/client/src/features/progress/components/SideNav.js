/**
 * @flow
 */

import React, { Component } from 'react'
import { darken } from 'polished'
import { withRouter, type Location } from 'react-router-dom'
import { connect } from 'react-redux'
import { arrayMove } from 'react-sortable-hoc'
import styled from 'styled-components'
import SortableList from './SortableList'
import { PrimaryButton, TmpButton } from '../../../common/components'
import { setSectionOrder, setProgress } from '../actions'
import { fetchIfNeededAndResetFormToSavedState, saveFellowData, publishPDF } from '../../tdi/actions'
import { sizes, colors } from '../../../common/theme'
import type { Section } from '../../../common/types'
import type { State } from '../../../app/types'

const Aside = styled.aside`
  position: fixed;
  left: 0;
  top: ${sizes.header};
  width: ${sizes.sideNav};
  height: calc(100% - ${sizes.header});
  display: flex;
  flex-direction: column;
  align-items: center;
  border-right: 1px solid ${colors.borders};

  @media screen and (max-width: 850px) {
    display: none;
  }
`

const Nav = styled.nav`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  top: 25px;
`

const TdiButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 20px;
  padding: 10px;
  border-style: solid;
  border-radius: 15px;
  border: 3px solid ${colors.borders};
`

type Props = {
  location: Location,
  sections: Array<Section>,
  setSectionOrder: (
    newSectionOrder: Array<Section>,
    currSection: Section
  ) => void,
  setProgress: (newSectionOrder: Array<Section>, currSection: Section) => void,
  fetchIfNeededAndResetFormToSavedState: *,
  saveFellowData: *
}

class SideNav extends Component<Props> {
  onSortStart = () => {
    this.toggleGrabCursor()
  }

  onSortEnd = ({ oldIndex, newIndex }) => {
    const { location, sections, setSectionOrder, setProgress } = this.props
    const newSectionOrder = arrayMove(sections, oldIndex, newIndex)
    const currSection: Section = (location.pathname.slice(11): any)

    setSectionOrder(newSectionOrder, currSection)
    setProgress(newSectionOrder, currSection)
    this.toggleGrabCursor()
  }

  // Pretty hacky, but meh
  toggleGrabCursor() {
    document.body && document.body.classList.toggle('grabbing')
  }

  handleSaveFellowDataClick = () => {
    const { sections, formValues, saveFellowData } = this.props
    saveFellowData({ ...formValues, sections })
  }

  handleResetFormToSavedStateClick = () => {
    const { fetchIfNeededAndResetFormToSavedState } = this.props
    fetchIfNeededAndResetFormToSavedState()
  }

  handleUploadPdfClick = () => {
    const { publishPDF } = this.props
    publishPDF()
  }

  render() {
    const { sections } = this.props

    return (
      <Aside>
        <Nav>
          <SortableList
            useDragHandle
            lockToContainerEdges
            lockAxis="y"
            items={sections}
            onSortStart={this.onSortStart}
            onSortEnd={this.onSortEnd}
          />
          <PrimaryButton type="submit" form="resume-form">
            Update Preview
          </PrimaryButton>
          <br />
          <TdiButtonContainer>
            <TmpButton style={{ margin: '10px' }} onClick={ this.handleSaveFellowDataClick }>
              Save
            </TmpButton>
            <TmpButton style={{ margin: '10px' }} onClick={ this.handleResetFormToSavedStateClick }>
              Reset to Saved Values
            </TmpButton>
            <TmpButton style={{ margin: '10px' }} onClick={ this.handleUploadPdfClick }>
              Upload PDF from Saved Values
            </TmpButton>
          </TdiButtonContainer>
        </Nav>
      </Aside>
    )
  }
}

function mapState(state: State) {
  return {
    sections: state.progress.sections,
    formValues: state.form.resume.values
  }
}

const mapActions = {
  setSectionOrder,
  setProgress,
  fetchIfNeededAndResetFormToSavedState,
  saveFellowData,
  publishPDF
}

const ConnectedSideNav = connect(mapState, mapActions)(SideNav)

export default withRouter(ConnectedSideNav)
