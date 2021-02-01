/*
 * Resources.hpp
 *
 * Copyright (C) 2021 by RStudio, PBC
 *
 * Unless you have received this program directly from RStudio pursuant
 * to the terms of a commercial license agreement with RStudio, then
 * this program is licensed to you under the terms of version 3 of the
 * GNU Affero General Public License. This program is distributed WITHOUT
 * ANY EXPRESS OR IMPLIED WARRANTY, INCLUDING THOSE OF NON-INFRINGEMENT,
 * MERCHANTABILITY OR FITNESS FOR A PARTICULAR PURPOSE. Please refer to the
 * AGPL (http://www.gnu.org/licenses/agpl-3.0.txt) for more details.
 *
 */

#ifndef CORE_SYSTEM_RESOURCES_HPP
#define CORE_SYSTEM_RESOURCES_HPP

#include <string>

namespace rstudio {
namespace core {

class Error;

namespace system {

// Enumeration of possible sources of memory information. When computing usage
// information, we indicate where the information comes from so we can provide
// detail in the UI.
enum MemoryProvider {
   // Source of stat unknown
   MemoryProviderUnknown = 0,

   // Native MacOS memory provider
   MemoryProviderMacOS,

   // Native Windows memory provider
   MemoryProviderWindows,

   // Linux provider based on cgroups; only available when process is inside a
   // cgroup
   MemoryProviderLinuxCgroups,
   
   // Linux provider based on ulimit; only useful if process has been given a
   // memory cap via setrlimit(1) and friends
   MemoryProviderLinuxUlimit,

   // Linux provider serving process memory information from the /proc virtual
   // filesystem
   MemoryProviderLinuxProcFs,

   // Linux provider serving system-wide memory stats from /proc/meminfo
   MemoryProviderLinuxProcMeminfo
};

Error getMemoryUsed(long *pUsedKb, MemoryProvider *pProvider);

Error getProcessMemoryUsed(long *pUsedKb, MemoryProvider *pProvider);

Error getTotalMemory(long *pTotalKb, MemoryProvider *pProvider);

} // namespace system
} // namespace core
} // namespace rstudio

#endif // CORE_SYSTEM_RESOURCES_HPP
