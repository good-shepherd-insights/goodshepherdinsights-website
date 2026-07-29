import {blogPost} from './blogPost'
import {service} from './service'
import {
  articleList,
  articleSection,
  callout,
  faq,
  framework,
  insightList,
  sources,
  tableOfContents,
  takeaways,
  tldr,
  useCase,
  vendorProfile,
} from './articleBlocks'
import {imageWithAlt, seoFields, simplePortableText} from './shared'
import {reusableButton, reusableComponents, reusableCtaSection} from './reusableComponents'
import {
  serviceCta,
  serviceImage,
  serviceIntro,
  serviceNarrative,
  serviceOffering,
  statCallout,
} from './serviceBlocks'
import {
  serviceCtaVideoSection,
  serviceFaqSection,
  serviceFeatureGridSection,
  serviceIndex,
  serviceProcessSection,
  serviceStatsMarqueeSection,
} from './serviceSections'

export const schemaTypes = [
  blogPost,
  service,
  imageWithAlt,
  reusableButton,
  reusableComponents,
  reusableCtaSection,
  seoFields,
  simplePortableText,
  articleSection,
  articleList,
  tldr,
  insightList,
  callout,
  takeaways,
  tableOfContents,
  faq,
  sources,
  framework,
  vendorProfile,
  useCase,
  serviceIntro,
  serviceNarrative,
  statCallout,
  serviceOffering,
  serviceCta,
  serviceImage,
  serviceIndex,
  serviceFeatureGridSection,
  serviceStatsMarqueeSection,
  serviceProcessSection,
  serviceCtaVideoSection,
  serviceFaqSection,
]
