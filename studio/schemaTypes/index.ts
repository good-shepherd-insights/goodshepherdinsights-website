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
import {
  serviceCta,
  serviceImage,
  serviceIntro,
  serviceNarrative,
  serviceOffering,
  statCallout,
} from './serviceBlocks'

export const schemaTypes = [
  blogPost,
  service,
  imageWithAlt,
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
]
