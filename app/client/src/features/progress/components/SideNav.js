/**
 * @flow
 */

import React, { Component } from 'react'
import ReactTooltip from 'react-tooltip'
import { lighten, darken, rgba } from 'polished'
import { withRouter, type Location } from 'react-router-dom'
import { connect } from 'react-redux'
import { arrayMove } from 'react-sortable-hoc'
import styled from 'styled-components'
import SortableList from './SortableList'
import { PrimaryButton } from '../../../common/components'
import { setSectionOrder, setProgress } from '../actions'
import { fetchIfNeededAndResetFormToSavedState, saveFellowData, publishPDF } from '../../tdi/actions'
import { previewMatchesFellowData } from '../../tdi/selectors'
import { sizes, colors } from '../../../common/theme'
import type { Section } from '../../../common/types'
import type { State } from '../../../app/types'
import { Heading } from '../../../features/form/components/sections/Section'

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

const RButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.85em;
  text-align: center;
  text-decoration: none;
  width: 175px;
  max-width: 100%;
  height: 45px;
  margin-top: 15px;
  background: transparent;
  color: white;
  border-radius: 100px;
  border: 1px solid ${darken(0.1, colors.primary)};
  box-shadow: 0 0 0 0 ${rgba(colors.primary, 0.7)};
  transition: all 0.4s ease;

  &:disabled {
    background: grey;
    color: ${darken(0.4, 'grey')};
    border: 1px solid white;
  }

  &:hover:enabled {
    background: linear-gradient(
      40deg,
      ${darken(0.5, colors.primary)},
      ${darken(0.3, colors.primary)}
    );
    animation: none;
    cursor: pointer;
  }

  &:active {
    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.06), 0 2px 40px rgba(0, 0, 0, 0.16);
    border-color: ${lighten(0.15, colors.primary)};
    color: ${lighten(0.15, colors.primary)};
  }

  &:focus {
    outline: none;
  }
`

const RFButton = RButton.extend`
  background: linear-gradient(
    40deg,
    ${darken(0.3, colors.primary)},
    ${colors.primary}
  );

  &:hover:enabled {
    background: linear-gradient(
      40deg,
      ${darken(0.4, colors.primary)},
      ${colors.primary}
    );
  }
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
  saveFellowData: *,
  disablePublish: boolean
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
    const { sections, disablePublish } = this.props

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
            Preview
          </PrimaryButton>
          <hr style={{
            height: '1px',
            color: colors.borders,
            width: '175px', // Matching buttons Resume Book buttons.
            maxWidth: '100%',
            margin: '30px'
          }} />
          <Heading>
            Resume Book
          </Heading>
          <RButton onClick={this.handleResetFormToSavedStateClick}>
            Load Data from Profile
          </RButton>
          <RButton onClick={this.handleSaveFellowDataClick}>
            Save Data to Profile
          </RButton>
          {/* NOTE: disabled button avoids the tooltip without the wrapping spans. */}
          {/* See: https://github.com/wwayne/react-tooltip/issues/304 */}
          <span
            style={{ marginTop: '15px' }} // Aligning the tooltip
            data-tip="Preview is not in sync with profile data."
            data-tip-disable={!disablePublish}>
            <RFButton style={{ marginTop: '0px' }} disabled={disablePublish} onClick={this.handleUploadPdfClick}>
              Publish
            </RFButton>
          </span>
          <ReactTooltip type="info" effect="solid" />
          {
            disablePublish
              ? <div style={{ margin: '0 30px', padding: '10px 0', width: '175px', maxWidth: '100%' }}>
                <p>Preview is not in sync with profile data.</p>
                <p>To publish the resume, please load data from the profile and update the preview.</p>
              </div>
              : null
          }
        </Nav>
      </Aside>
    )
  }
}

function mapState(state: State) {
  return {
    sections: state.progress.sections,
    formValues: state.form.resume.values,
    disablePublish: !previewMatchesFellowData(state)
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
